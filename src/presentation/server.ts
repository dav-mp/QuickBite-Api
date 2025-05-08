// src/presentation/server.ts

import express, { Request, Response, Router } from 'express';
import { Server as HttpServer } from 'http';
import { WSNotificationServer } from './websocket/WebSocketServer';
import { validateTokenMiddleware } from './middlewares/validateToken.middleware';

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
    // Middlewares para parsear JSON, urlencoded, etc.
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.get('/', (_req, res) => {
      res.status(200).json({ message: 'API funcionando' });
    });

    // *** Aquí montamos nuestro middleware de protección ***
    // Esto hará que todos los endpoints (excepto /api/auth/...) requieran token
    this.app.use(validateTokenMiddleware);

    // Routes
    this.app.use(this.routes);

    // Ping (opcional)
    this.app.get('/', async (req: Request, res: Response) => {
      res.status(200).json({ message: 'API funcionando' });
    });

    // Init HTTP server + WebSocket
    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
      WSNotificationServer.initialize(this.serverListener as HttpServer);
    });
  }

  public close() {
    this.serverListener?.close();
  }
}
