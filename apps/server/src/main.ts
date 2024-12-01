import { bootstrap } from './app';

const port = process.env.PORT || 4500;

(async () => {
  try {
    const app = await bootstrap();
    await app.listen(port);
  } catch (err) {
    console.log('Uncaught exception! Shutting down...');
    console.log(err.name, err.message);
    console.log(err);

    process.exit(1);
  }
})();
