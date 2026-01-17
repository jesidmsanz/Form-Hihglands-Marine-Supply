import { NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';
import configEnv from '@/server/configEnv';
import controller from '@/server/components/users/controller';

// Helper para respuestas exitosas
function successResponse(data, status = 200) {
  return NextResponse.json({ error: '', body: data }, { status });
}

// Helper para respuestas de error
function errorResponse(message, status = 400, details = null) {
  console.log('[response message]', message);
  return NextResponse.json({ error: message, body: '' }, { status });
}

// POST: /api/users/sign-up - User registration
export async function POST(request) {
  try {
    const body = await request.json();
    const user = await controller.signUp(body);
    const { _id: id, firstName, lastName, username } = user;

    const payload = {
      sub: id,
      name: `${firstName} ${lastName}`,
      username,
    };

    const token = jwt.sign(payload, configEnv.authJwtSecret, {
      expiresIn: configEnv.jwtSessionExpire,
    });

    const userResult = {
      ...user,
      token,
    };

    return successResponse(userResult);
  } catch (error) {
    console.log('ERROR: ', error);
    return errorResponse('Error registering user', 400, error);
  }
}

