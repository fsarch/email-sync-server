import { FsArchAppBuilder } from '@fsarch/server';
import { AppModule } from './app.module.js';
import { Role } from './constants/role.enum.js';
import { DATABASE_OPTIONS } from './database/index.js';

async function bootstrap() {
  const app = await new FsArchAppBuilder(AppModule, {
    name: 'Email-Sync-Server',
    version: '1.0',
  })
    .addSwagger({
      title: 'Email-Sync-Server',
      description:
        'A server for sending and receiving email using imap and smtp',
      version: '1.0',
      path: 'docs',
    })
    .enableAuth()
    .enableUac(Object.values(Role))
    .setDatabase(DATABASE_OPTIONS)
    .build();

  await app.listen(process.env.PORT ?? 8080);
}

bootstrap();
