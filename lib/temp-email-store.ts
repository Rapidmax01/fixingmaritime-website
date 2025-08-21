// Temporary in-memory storage for email verification tokens
// This is for demo/testing purposes only - in production, use database

interface VerificationToken {
  email: string
  token: string
  expires: Date
}

// In-memory store
const verificationTokens = new Map<string, VerificationToken>()

export function storeVerificationToken(email: string, token: string): void {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  verificationTokens.set(token, { email, token, expires })
  
  // Clean up expired tokens
  cleanupExpiredTokens()
}

export function getVerificationToken(token: string): VerificationToken | null {
  const verification = verificationTokens.get(token)
  
  if (!verification) {
    return null
  }
  
  // Check if expired
  if (verification.expires < new Date()) {
    verificationTokens.delete(token)
    return null
  }
  
  return verification
}

export function deleteVerificationToken(token: string): void {
  verificationTokens.delete(token)
}

export function isEmailVerified(email: string): boolean {
  // For demo purposes, we'll track verified emails in memory
  return verifiedEmails.has(email)
}

export function markEmailAsVerified(email: string): void {
  verifiedEmails.add(email)
  
  // Remove any verification tokens for this email
  Array.from(verificationTokens.entries()).forEach(([token, verification]) => {
    if (verification.email === email) {
      verificationTokens.delete(token)
    }
  })
}

// Store verified emails
const verifiedEmails = new Set<string>()

// Cleanup expired tokens
function cleanupExpiredTokens(): void {
  const now = new Date()
  Array.from(verificationTokens.entries()).forEach(([token, verification]) => {
    if (verification.expires < now) {
      verificationTokens.delete(token)
    }
  })
}

// For debugging
export function getStoredTokens(): Map<string, VerificationToken> {
  cleanupExpiredTokens()
  return verificationTokens
}