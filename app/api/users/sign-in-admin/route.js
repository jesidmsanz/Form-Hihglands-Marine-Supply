import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import configEnv from '@/server/configEnv';
import { getUser } from '@/server/components/users/controller';

// Helper para respuestas exitosas
function successResponse(data, status = 200) {
  return NextResponse.json({ error: '', body: data }, { status });
}

// Helper para respuestas de error
function errorResponse(message, status = 400) {
  return NextResponse.json({ error: message, body: '' }, { status });
}

// POST: /api/users/sign-in-admin - Admin login
export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return errorResponse('Username and password are required', 400);
    }

    // Get user from database
    const user = await getUser({ username });
    if (!user) {
      return errorResponse('Invalid credentials', 401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return errorResponse('Invalid credentials', 401);
    }

    // Check admin role
    if (!user.roles || !user.roles.includes('admin')) {
      return errorResponse('You do not have administrator permissions', 403);
    }

    // Generate JWT token
    delete user.password;
    const { _id: id, firstName, lastName, username: userUsername } = user;

    const payload = {
      sub: id,
      name: `${firstName} ${lastName}`,
      username: userUsername,
    };

    const token = jwt.sign(payload, configEnv.authJwtSecret, {
      expiresIn: configEnv.jwtSessionExpire,
    });

    const userResult = {
      ...user,
      token,
    };

    return successResponse({ user: userResult });
  } catch (error) {
    console.log('ERROR: ', error);
    return errorResponse('Invalid credentials', 401);
  }
}
