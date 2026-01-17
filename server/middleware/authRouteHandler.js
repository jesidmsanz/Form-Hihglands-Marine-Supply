import * as jwt from 'jsonwebtoken';
import { getUser } from '@/server/components/users/controller';
import config from '@/server/configEnv/index';

/**
 * JWT Authentication Middleware for Next.js Route Handlers
 * Returns user object or error
 */
export async function authenticateJWT(request) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'Unauthorized. Please login to continue', user: null };
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    let tokenPayload;
    try {
      tokenPayload = jwt.verify(token, config.authJwtSecret);
    } catch (err) {
      return { error: 'Invalid or expired token', user: null };
    }

    // Get user from database
    const { username } = tokenPayload;
    const user = await getUser({ username });

    if (!user) {
      return { error: 'Unauthorized. Please login to continue', user: null };
    }

    // Prepare user object
    user.id = user._id;
    delete user.password;

    return { error: null, user: { ...user, scopes: tokenPayload.scopes } };
  } catch (error) {
    console.error('Authentication error:', error);
    return { error: 'Authentication failed', user: null };
  }
}

