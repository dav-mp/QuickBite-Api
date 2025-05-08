import { envs } from './config/envs';
import { InitBD } from './data/PrismaPostgresql';
import { AuthServiceProvider } from './data/supabase/AuthServiceProvider';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';

(async () => {
  main();
})();

function main() {
  if (!envs.PORT) {
    console.error('El puerto no está definido en las variables de entorno.');
    process.exit(1);
  }

  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  Promise.all([
    InitBD.initBdConnection(),
    AuthServiceProvider.getAuthServiceProvider(envs.SUPABASE_URL, envs.SUPABASE_ANON_KEY),
  ])
    .then(() => {
      server.start();
    })
    .catch((err) => {
      console.log('ERROR AL INICIAR SERVICIO', err);
      process.exit(1);
    });
}
