import { WebSocketServer, WebSocket } from 'ws';   // ⬅️ exportaciones con nombre
import { Server as HttpServer } from 'http';

export type ClientRole = 'user' | 'restaurant';

export class WSNotificationServer {
  private static instance: WSNotificationServer;

  // usa el nuevo tipo
  private wss: WebSocketServer;

  private users = new Map<string, WebSocket>();
  private restaurants = new Map<string, WebSocket>();

  private constructor(server: HttpServer) {
    this.wss = new WebSocketServer({ server });   // ⬅️ nuevo constructor

    this.wss.on('connection', (socket) => {
      socket.send(JSON.stringify({ status: true }));

      socket.on('message', (data) => {
        // data es Buffer | ArrayBuffer | string
        const message = data.toString();          // conviértelo a string
        try {
          const parsed = JSON.parse(message);
          if (parsed.type === 'register' && parsed.uid && parsed.role) {
            this.registerClient(parsed.role, parsed.uid, socket);
            socket.send(JSON.stringify({ event: 'registered', ...parsed }));
          }
        } catch (err) {
          console.error('Mensaje WebSocket inválido:', message);
        }
      });

      socket.on('close', () => this.removeClient(socket));
    });
  }

    // Inicializa el WS server a partir del servidor HTTP (se debe llamar una sola vez)
    public static initialize(server: HttpServer): WSNotificationServer {
        if (!WSNotificationServer.instance) {
        WSNotificationServer.instance = new WSNotificationServer(server);
        }
        return WSNotificationServer.instance;
    }

    // Obtiene la instancia (asegúrate de haber llamado a initialize previamente)
    public static getInstance(): WSNotificationServer {
        if (!WSNotificationServer.instance) {
        throw new Error(
            'El servidor WebSocket no ha sido inicializado. Llama a WSNotificationServer.initialize(server) en el arranque.'
        );
        }
        return WSNotificationServer.instance;
    }

    // Registra al cliente según su rol y uid.
    private registerClient(role: ClientRole, uid: string, socket: WebSocket) {
        this.restaurants.forEach((socket, uid) => {
            console.log(socket);
            
            console.log(`Restaurante ya registrado: uid=${uid}`);
        });
        console.log(uid);
        
        
        if (role === 'user') {
            this.users.set(uid, socket);
            console.log(`Usuario registrado, uid: ${uid}`);
        } else if (role === 'restaurant') {
            this.restaurants.set(uid, socket);
            console.log(`Restaurante registrado, uid: ${uid}`);
        }
    }

    // Elimina la conexión registrada (se busca en ambas colecciones).
    private removeClient(socket: WebSocket) {
        for (const [uid, ws] of this.users) {
            if (ws === socket) {
                this.users.delete(uid);
                console.log(`Usuario desconectado, uid: ${uid}`);
                return;
            }
        }
        for (const [uid, ws] of this.restaurants) {
            if (ws === socket) {
                this.restaurants.delete(uid);
                console.log(`Restaurante desconectado, uid: ${uid}`);
                return;
            }
        }
    }

    // Envía una notificación al cliente que corresponda según su rol y uid.
    public notify(role: ClientRole, uid: string, message: any) {
        let targetSocket: WebSocket | undefined;
        console.log(uid);
        
        if (role === 'user') {
            targetSocket = this.users.get(uid);
        } else if (role === 'restaurant') {
            targetSocket = this.restaurants.get(uid);
        }
        if (targetSocket && targetSocket.readyState === WebSocket.OPEN) {
            targetSocket.send(JSON.stringify(message));
            console.log(`Notificación enviada a ${role} (uid: ${uid})`);
        } else {
            console.log(`No existe conexión activa para ${role} (uid: ${uid}).`);
        }
    }

}