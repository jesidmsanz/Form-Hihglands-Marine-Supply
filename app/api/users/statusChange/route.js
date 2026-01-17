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

// POST: /api/users/statusChange - Change user status (Authenticated)
export async function POST(request) {
  try {
    // Verificar autenticación
    const authResult = await authenticateJWT(request);
    if (authResult.error) {
      return errorResponse(authResult.error, 401);
    }

    const body = await request.json();
    const model = await controller.statusChange(body, authResult.user);
    return successResponse(model);
  } catch (error) {
    console.log('ERROR: ', error);
    return errorResponse('Error changing user status', 400, error);
  }
}

