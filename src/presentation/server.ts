// src/presentation/server.ts

import express, { Request, Response, Router } from 'express';
import cors from 'cors';
import { Server as HttpServer } from 'http';
import { WSNotificationServer } from './websocket/WebSocketServer';
import { validateTokenMiddleware } from './middlewares/validateToken.middleware';
import { envs } from '../config/envs';  // si quieres leer orígenes desde .env

interface Options {
  port: number;
  routes: Router;
  public_path?: string;
}

export class Server {
  public readonly app = express();
  private serverListener?: HttpServer;
  private readonly port: number;
  private readonly routes: Router;

  constructor(options: Options) {
    this.port = options.port;
    this.routes = options.routes;
  }

  async start() {
    // 1) CORS
    // Si quieres permitir todos los orígenes:
    this.app.use(
      cors({
        origin: [
          'https://quick-bite-seven-orpin.vercel.app', // Vercel
        ],
        // Si usas cookies/sesiones:
        // credentials: true,
      })
    );
    
    // O bien restringir a ciertos dominios:
    // const allowed = envs.ALLOWED_ORIGINS.split(',');
    // this.app.use(cors({ origin: allowed, credentials: true }));

    // 2) Parsers
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // 3) Ruta raíz de prueba
    this.app.get('/', (_req, res) => {
      res.status(200).json({ message: 'API funcionando' });
    });

    // 4) Middleware de validación de token
    this.app.use(validateTokenMiddleware);

    // 5) Rutas de la aplicación
    this.app.use(this.routes);

    // 6) Ping (opcional, mismo que más arriba)
    this.app.get('/', async (_req: Request, res: Response) => {
      res.status(200).json({ message: 'API funcionando' });
    });

    // 7) Inicializar HTTP + WS
    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
      WSNotificationServer.initialize(this.serverListener as HttpServer);
    });
  }

  public close() {
    this.serverListener?.close();
  }
}
