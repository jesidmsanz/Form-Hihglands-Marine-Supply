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

// POST: /api/users/change-password - Change password (Authenticated)
export async function POST(request) {
  try {
    // Verificar autenticación
    const authResult = await authenticateJWT(request);
    if (authResult.error) {
      return errorResponse(authResult.error, 401);
    }

    const body = await request.json();
    body.id = authResult.user.id;
    const result = await controller.changePassword(body);
    return successResponse(result);
  } catch (error) {
    console.log('ERROR: ', error);
    return errorResponse('Error changing password', 400, error);
  }
}

