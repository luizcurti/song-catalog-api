import { App } from './app';
import { logger } from './logger';

(async () => {
  const app = new App();
  await app.init();

  const port = process.env.PORT || 3005;

  app.server.listen(port, () => {
    logger.info(`listening on port ${port}`);
  });
})();
