import { NextResponse } from 'next/server';
import { createJWT, hashPassword, verifyPassword } from '@/lib/security/auth';
import { isValidEmail, isValidUsername, isValidPassword, sanitizeInput } from '@/lib/security/validation';
import { checkRateLimit, RATE_LIMITS } from '@/lib/security/rateLimit';
import { createSecurityHeaders } from '@/lib/security/middleware';

// In-memory user store (replace with database in production)
const users: Map<string, {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}> = new Map();

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

  // Rate limiting for auth
  const rateLimit = checkRateLimit(`auth:${ip}`, RATE_LIMITS.auth);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const { action, username, email, password } = await req.json();

    if (action === 'register') {
      // Validate inputs
      if (!username || !isValidUsername(username)) {
        return NextResponse.json(
          { error: 'Username must be 3-20 characters (letters, numbers, underscore)' },
          { status: 400 }
        );
      }

      if (!email || !isValidEmail(email)) {
        return NextResponse.json(
          { error: 'Invalid email address' },
          { status: 400 }
        );
      }

      const passwordValidation = isValidPassword(password);
      if (!passwordValidation.valid) {
        return NextResponse.json(
          { error: passwordValidation.errors[0] },
          { status: 400 }
        );
      }

      // Check if user exists
      for (const user of Array.from(users.values())) {
        if (user.username === username) {
          return NextResponse.json(
            { error: 'Username already taken' },
            { status: 409 }
          );
        }
        if (user.email === email) {
          return NextResponse.json(
            { error: 'Email already registered' },
            { status: 409 }
          );
        }
      }

      // Create user
      const userId = crypto.randomUUID();
      const hashedPassword = hashPassword(password);

      users.set(userId, {
        id: userId,
        username: sanitizeInput(username),
        email: email.toLowerCase(),
        password: hashedPassword,
        createdAt: new Date(),
      });

      // Generate JWT
      const token = createJWT({ userId, username: sanitizeInput(username) });

      const response = NextResponse.json({
        success: true,
        user: { id: userId, username: sanitizeInput(username) },
        token,
      });

      // Set secure cookie
      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      });

      // Add security headers
      const securityHeaders = createSecurityHeaders();
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    }

    if (action === 'login') {
      if (!username || !password) {
        return NextResponse.json(
          { error: 'Username and password required' },
          { status: 400 }
        );
      }

      // Find user
      let foundUser = null;
      for (const user of Array.from(users.values())) {
        if (user.username === username || user.email === username) {
          foundUser = user;
          break;
        }
      }

      if (!foundUser || !verifyPassword(password, foundUser.password)) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      // Generate JWT
      const token = createJWT({
        userId: foundUser.id,
        username: foundUser.username,
      });

      const response = NextResponse.json({
        success: true,
        user: { id: foundUser.id, username: foundUser.username },
        token,
      });

      // Set secure cookie
      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });

      // Add security headers
      const securityHeaders = createSecurityHeaders();
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Auth Error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

// Logout
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('auth_token');
  return response;
}
