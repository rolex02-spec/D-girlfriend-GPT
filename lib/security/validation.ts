// XSS Protection - Sanitize user input
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Strip HTML tags completely
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '');
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// Validate username (alphanumeric, 3-20 chars)
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

// Validate password strength
export function isValidPassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return { valid: errors.length === 0, errors };
}

// Validate message content
export function isValidMessage(message: string): boolean {
  if (!message || message.trim().length === 0) return false;
  if (message.length > 10000) return false; // Max 10k chars
  return true;
}

// Check for potentially malicious content
export function containsMaliciousContent(input: string): boolean {
  const maliciousPatterns = [
    /<script\b[^>]*>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:text\/html/gi,
    /vbscript:/gi,
    /expression\(/gi,
    /eval\(/gi,
    /document\./gi,
    /window\./gi,
    /alert\(/gi,
    /prompt\(/gi,
    /confirm\(/gi,
    /fetch\(/gi,
    /XMLHttpRequest/gi,
    /\.cookie/gi,
    /document\.write/gi,
  ];

  return maliciousPatterns.some((pattern) => pattern.test(input));
}

// Validate and sanitize chat message
export function validateChatMessage(message: string): {
  valid: boolean;
  sanitized: string;
  error?: string;
} {
  if (!message) {
    return { valid: false, sanitized: '', error: 'Message is required' };
  }

  if (message.length > 10000) {
    return { valid: false, sanitized: '', error: 'Message too long (max 10,000 characters)' };
  }

  if (containsMaliciousContent(message)) {
    return { valid: false, sanitized: '', error: 'Invalid content detected' };
  }

  const sanitized = stripHtml(sanitizeInput(message));

  return { valid: true, sanitized };
}

// Validate character ID
export function isValidCharacterId(id: string): boolean {
  const idRegex = /^[a-zA-Z0-9_-]{1,50}$/;
  return idRegex.test(id);
}

// Generate CSRF token
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}
