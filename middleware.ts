import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Security middleware that runs on every request
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-DNS-Prefetch-Control', 'on');

  // CSP Headers - allow necessary resources
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' data: https://fonts.gstatic.com; " +
    "img-src 'self' data: https: blob:; " +
    "connect-src 'self' https://openrouter.ai https://api.groq.com https://api.together.xyz https://api.opencode.ai http://localhost:11434 wss://localhost:11434; " +
    "media-src 'self' blob:; " +
    "object-src 'none'; " +
    "frame-ancestors 'self';"
  );

  // Remove server header
  response.headers.delete('Server');
  response.headers.delete('X-Powered-By');

  // Block common attack paths (but allow legitimate API routes)
  const blockedPaths = [
    '/wp-admin',
    '/wp-login',
    '/wp-content',
    '/.env',
    '/.git',
    '/config',
    '/admin',
    '/phpmyadmin',
    '/.htaccess',
    '/server-status',
  ];

  const pathname = request.nextUrl.pathname.toLowerCase();
  if (blockedPaths.some((path) => pathname.startsWith(path))) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // Only block truly suspicious user agents (bots/scanners)
  const userAgent = request.headers.get('user-agent') || '';
  const suspiciousAgents = [
    'sqlmap',
    'nikto',
    'masscan',
    'nmap',
    'nessus',
    'openvas',
    'acunetix',
    'burpsuite',
  ];

  if (suspiciousAgents.some((agent) => userAgent.toLowerCase().includes(agent))) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Block requests with suspicious query parameters (SQL injection, XSS)
  const url = request.url;
  const suspiciousPatterns = [
    /(union\s+select)/i,
    /(drop\s+table)/i,
    /(insert\s+into)/i,
    /(delete\s+from)/i,
    /(<script[^>]*>)/i,
    /(javascript:)/i,
    /(eval\()/i,
    /(document\.cookie)/i,
  ];

  if (suspiciousPatterns.some((pattern) => pattern.test(url))) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.webp$|.*\\.svg$|.*\\.ico$).*)',
  ],
};