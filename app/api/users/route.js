import { NextResponse } from 'next/server';
import controller from '@/server/components/users/controller';
import { authenticateJWT } from '@/server/middleware/authRouteHandler';

// Helper para respuestas exitosas
function successResponse(data, status = 200) {
  return NextResponse.json({ error: '', body: data }, { status });
}

// Helper para respuestas de error
function errorResponse(message, status = 400, details = null) {
  console.log('[response message]', message);
  return NextResponse.json({ error: message, body: '' }, { status });
}

// GET: /api/users - Get all users (Public for now, can be protected if needed)
export async function GET(request) {
  try {
    const result = await controller.findAll();
    return successResponse(result);
  } catch (error) {
    console.log('ERROR: ', error);
    return errorResponse('Error fetching users', 400, error);
  }
}

// POST: /api/users - Create new user (Authenticated)
export async function POST(request) {
  try {
    // Verificar autenticación
    const authResult = await authenticateJWT(request);
    if (authResult.error) {
      return errorResponse(authResult.error, 401);
    }

    const body = await request.json();
    const user = await controller.create(body);
    return successResponse(user);
  } catch (error) {
    console.log('ERROR: ', error);
    return errorResponse('Error registering user', 400, error);
  }
}

