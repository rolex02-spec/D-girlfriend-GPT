import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from './auth';
import { checkRateLimit, RATE_LIMITS } from './rateLimit';

export interface SecurityContext {
  userId?: string;
  username?: string;
  ip: string;
}

export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  return '127.0.0.1';
}

export function authenticateRequest(request: NextRequest): SecurityContext | null {
  const ip = getClientIP(request);

  // Get token from Authorization header or cookie
  const authHeader = request.headers.get('authorization');
  const cookieToken = request.cookies.get('auth_token')?.value;

  let token: string | null = null;

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (cookieToken) {
    token = cookieToken;
  }

  if (!token) {
    return null;
  }

  const payload = verifyJWT(token);
  if (!payload) {
    return null;
  }

  return {
    userId: payload.userId,
    username: payload.username,
    ip,
  };
}

export function checkApiRateLimit(
  ip: string,
  type: 'default' | 'strict' | 'auth' = 'default'
): { allowed: boolean; headers: Record<string, string> } {
  const config = RATE_LIMITS[type];
  const result = checkRateLimit(ip, config);

  return {
    allowed: result.allowed,
    headers: {
      'X-RateLimit-Limit': String(config.maxRequests),
      'X-RateLimit-Remaining': String(result.remaining),
      'X-RateLimit-Reset': String(Math.ceil(result.resetIn / 1000)),
      'Retry-After': result.allowed ? '' : String(Math.ceil(result.resetIn / 1000)),
    },
  };
}

export function createSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://openrouter.ai https://api.groq.com https://api.together.xyz http://localhost:11434;",
  };
}

export function withSecurity(
  handler: (req: NextRequest, ctx: SecurityContext) => Promise<NextResponse>,
  options: {
    requireAuth?: boolean;
    rateLimitType?: 'default' | 'strict' | 'auth';
  } = {}
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const ip = getClientIP(req);

    // Rate limiting
    const rateLimit = checkApiRateLimit(ip, options.rateLimitType || 'default');
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: rateLimit.headers }
      );
    }

    // Authentication (if required)
    let ctx: SecurityContext = { ip };
    if (options.requireAuth) {
      const auth = authenticateRequest(req);
      if (!auth) {
        return NextResponse.json(
          { error: 'Unauthorized. Please log in.' },
          { status: 401, headers: rateLimit.headers }
        );
      }
      ctx = auth;
    }

    // Add security headers to response
    const response = await handler(req, ctx);
    const securityHeaders = createSecurityHeaders();

    for (const [key, value] of Object.entries(securityHeaders)) {
      response.headers.set(key, value);
    }

    // Add rate limit headers
    for (const [key, value] of Object.entries(rateLimit.headers)) {
      if (value) response.headers.set(key, value);
    }

    return response;
  };
}
