import { Request, Response, NextFunction } from 'express';
import { CustomeError } from '../../data/domain/errors/custom.error';
import { AuthServiceProvider } from '../../data/supabase/AuthServiceProvider';
import { JwtAdapter } from '../../config/JWT';

/**
 * Middleware que protege la mayoría de endpoints, exceptuando '/api/auth/...'.
 * Intenta validar el token con Supabase primero, y si falla, con el JWT interno.
 */
export const validateTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Si es un endpoint de auth, lo dejamos pasar sin validar
  if (req.path.startsWith('/api/auth')) {
    return next();
  }

  // 2. Verificamos si hay cabecera Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(CustomeError.unauthorized('No token provided'));
  }

  // 3. Validamos el formato del token (Bearer <token>)
  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return next(CustomeError.unauthorized('Malformed token'));
  }
  const token = parts[1];

  // 4. Intentar validar con Supabase
  try {
    // Asegúrate de que en app.ts ya has hecho el AuthServiceProvider.getAuthServiceProvider(...) 
    // para inicializar el cliente de Supabase correctamente.
    const supabase = AuthServiceProvider.getClient();
    const { data, error } = await supabase.auth.getUser(token);
    if (!error && data?.user) {
      // Si es válido el token de Supabase, guardamos el usuario en la request
      (req as any).authUser = data.user;
      return next();
    }
  } catch (error) {
    // Si algo falla internamente en Supabase, seguimos con el siguiente paso (JWT interno)
  }

  // 5. Intentar validar con tu JWT interno
  try {
    const decoded = await JwtAdapter.validateToken<any>(token);
    if (decoded) {
      // Si es válido, guardamos la info decodificada en la request (opcional)
      (req as any).authUser = decoded;
      return next();
    }
  } catch {
    // Si falla la verificación de tu JWT, caemos al error de abajo
  }

  // 6. Si ninguno de los validadores pasó, denegamos el acceso
  return next(CustomeError.unauthorized('Invalid token'));
};
