'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import configEnv from '@/server/configEnv';
import { getUser } from '@/server/components/users/controller';

// Schema de validación con Zod
const loginSchema = z.object({
  username: z.string().email('Invalid email format').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

// Tipo TypeScript inferido del schema
export type LoginInput = z.infer<typeof loginSchema>;

// Resultado tipado del Server Action
export type LoginResult =
  | {
      success: true;
      user: { id: string; email: string; name: string; token: string; roles: string[] };
    }
  | { success: false; error: string };

export async function loginAction(formData: FormData): Promise<LoginResult> {
  try {
    // Extraer datos del FormData
    const rawData = {
      username: formData.get('username')?.toString() || '',
      password: formData.get('password')?.toString() || '',
    };

    // Validar con Zod (se valida ANTES de llegar a la lógica)
    const validationResult = loginSchema.safeParse(rawData);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return {
        success: false,
        error: firstError?.message || 'Invalid input',
      };
    }

    const { username, password } = validationResult.data;

    // Buscar usuario en la base de datos
    const user = await getUser({ username });
    if (!user) {
      return {
        success: false,
        error: 'Invalid credentials',
      };
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return {
        success: false,
        error: 'Invalid credentials',
      };
    }

    // Generar JWT token
    const { _id: id, firstName, lastName, username: userUsername, roles } = user;

    const payload = {
      sub: id,
      name: `${firstName} ${lastName}`,
      username: userUsername,
    };

    const token = jwt.sign(payload, configEnv.authJwtSecret, {
      expiresIn: configEnv.jwtSessionExpire,
    });

    return {
      success: true,
      user: {
        id: id.toString(),
        email: userUsername,
        name: `${firstName} ${lastName}`.trim(),
        token,
        roles: roles || [],
      },
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'An error occurred during login',
    };
  }
}

export async function loginActionWithObject(input: LoginInput): Promise<LoginResult> {
  try {
    // Validar con Zod
    const validationResult = loginSchema.safeParse(input);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return {
        success: false,
        error: firstError?.message || 'Invalid input',
      };
    }

    const { username, password } = validationResult.data;

    // Buscar usuario
    const user = await getUser({ username });
    if (!user) {
      return {
        success: false,
        error: 'Invalid credentials',
      };
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return {
        success: false,
        error: 'Invalid credentials',
      };
    }

    // Generar JWT token
    const { _id: id, firstName, lastName, username: userUsername, roles } = user;

    const payload = {
      sub: id,
      name: `${firstName} ${lastName}`,
      username: userUsername,
    };

    const token = jwt.sign(payload, configEnv.authJwtSecret, {
      expiresIn: configEnv.jwtSessionExpire,
    });

    return {
      success: true,
      user: {
        id: id.toString(),
        email: userUsername,
        name: `${firstName} ${lastName}`.trim(),
        token,
        roles: roles || [],
      },
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'An error occurred during login',
    };
  }
}
