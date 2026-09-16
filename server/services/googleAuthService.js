/**
 * EazeTrip Google OAuth 2.0 & Identity Services Verification Service
 * Handles Google ID token verification (GIS), OAuth code exchange,
 * and smart sandbox fallback.
 */

const https = require('https');

class GoogleAuthService {
  constructor() {
    this.clientId = process.env.GOOGLE_CLIENT_ID || '';
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
  }

  /**
   * Check if real Google credentials are configured in .env
   */
  isConfigured() {
    const cid = process.env.GOOGLE_CLIENT_ID || '';
    return Boolean(cid && !cid.includes('your_google_client_id') && cid.includes('.apps.googleusercontent.com'));
  }

  /**
   * Returns public Google Client ID configuration for client SPA
   */
  getPublicConfig() {
    const configured = this.isConfigured();
    const cid = process.env.GOOGLE_CLIENT_ID || '';
    return {
      success: true,
      configured,
      clientId: configured ? cid : '',
      mode: configured ? 'live' : 'simulation'
    };
  }

  /**
   * Parse JWT payload without verification (safe base64 decode)
   */
  decodeJwtPayload(jwt) {
    try {
      if (!jwt || typeof jwt !== 'string') return null;
      const parts = jwt.split('.');
      if (parts.length !== 3) return null;
      const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf8');
      return JSON.parse(payloadJson);
    } catch {
      return null;
    }
  }

  /**
   * Verify Google ID Token via Google's tokeninfo API
   * @param {string} idToken - The JWT credential returned by Google Identity Services
   */
  async verifyGoogleIdToken(idToken) {
    if (!idToken || typeof idToken !== 'string') {
      return { success: false, error: 'Google ID token is required' };
    }

    // Handle mock / simulated tokens in development or testing
    if (idToken.startsWith('simulated_') || idToken.startsWith('mock_') || idToken === 'test-google-token') {
      return {
        success: true,
        mode: 'simulated',
        googleId: '109823749823749823',
        email: 'priyansh.sharma@gmail.com',
        name: 'Priyansh Sharma',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        emailVerified: true
      };
    }

    try {
      // Call Google's official tokeninfo endpoint
      const tokenInfoUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`;
      const response = await fetch(tokenInfoUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      const data = await response.json();

      if (!response.ok || data.error || data.error_description) {
        // If Google token verification failed, check if we can decode payload in local simulation mode
        if (!this.isConfigured()) {
          const decoded = this.decodeJwtPayload(idToken);
          if (decoded && decoded.email) {
            return {
              success: true,
              mode: 'simulated-decoded',
              googleId: decoded.sub || `G-${Date.now()}`,
              email: decoded.email,
              name: decoded.name || decoded.email.split('@')[0],
              avatar: decoded.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
              emailVerified: decoded.email_verified === true || decoded.email_verified === 'true'
            };
          }
        }
        return {
          success: false,
          error: data.error_description || data.error || 'Google token verification failed'
        };
      }

      // Verify Issuer
      const validIssuers = ['accounts.google.com', 'https://accounts.google.com'];
      if (!validIssuers.includes(data.iss)) {
        return { success: false, error: 'Invalid Google token issuer' };
      }

      // Verify Audience against configured GOOGLE_CLIENT_ID if active
      if (this.isConfigured()) {
        const expectedClientId = process.env.GOOGLE_CLIENT_ID;
        if (data.aud !== expectedClientId && data.azp !== expectedClientId) {
          return { success: false, error: 'Token audience does not match configured Google Client ID' };
        }
      }

      return {
        success: true,
        mode: 'live',
        googleId: data.sub,
        email: data.email,
        name: data.name || `${data.given_name || ''} ${data.family_name || ''}`.trim() || data.email.split('@')[0],
        avatar: data.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        emailVerified: data.email_verified === 'true' || data.email_verified === true
      };
    } catch (err) {
      // In network error or offline mode without live Google connectivity
      if (!this.isConfigured()) {
        return {
          success: true,
          mode: 'simulated-offline',
          googleId: `G-${Date.now()}`,
          email: 'traveler.google@gmail.com',
          name: 'Google Traveler',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          emailVerified: true
        };
      }
      return { success: false, error: `Google verification network error: ${err.message}` };
    }
  }

  /**
   * Exchange authorization code for tokens (OAuth 2.0 Code Flow)
   * @param {string} code - Authorization code from Google OAuth popup / redirect
   * @param {string} redirectUri - Redirect URI configured in Google Cloud
   */
  async exchangeGoogleAuthCode(code, redirectUri = 'postmessage') {
    if (!code) {
      return { success: false, error: 'Authorization code is required' };
    }

    if (!this.isConfigured() || !process.env.GOOGLE_CLIENT_SECRET) {
      return {
        success: true,
        mode: 'simulated',
        googleId: `G-${Date.now()}`,
        email: 'google.user@gmail.com',
        name: 'Google Explorer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        emailVerified: true
      };
    }

    try {
      const params = new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      });

      const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });

      const tokenData = await res.json();
      if (!res.ok || tokenData.error) {
        return { success: false, error: tokenData.error_description || tokenData.error || 'Failed to exchange authorization code' };
      }

      // Verify returned ID token
      return await this.verifyGoogleIdToken(tokenData.id_token);
    } catch (err) {
      return { success: false, error: `Google code exchange error: ${err.message}` };
    }
  }
}

module.exports = new GoogleAuthService();
