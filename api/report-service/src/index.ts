import { $log } from '@tsed/common';
import { PlatformExpress } from '@tsed/platform-express';

import { Server } from './server';

const port = process.env.PORT || 3002;

async function start() {
  const platform = await PlatformExpress.bootstrap(Server, {
    port,
    logger: {
      logRequest: false,
      disableBootstrapLog: true,
    },
  });
  await platform.listen();
  $log.info(`Report Service ready at http://localhost:${port}`);
}

start();
