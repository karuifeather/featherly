import { APIGatewayProxyEvent, Callback, Context, Handler } from 'aws-lambda';
import { bootstrap } from './app';
import serverlessExpress from '@vendia/serverless-express';
import * as dotenv from 'dotenv';

dotenv.config();
let server: Handler;

async function serverlessBootstrap() {
  try {
    const app = await bootstrap();
    await app.init();

    const expressApp = app.getHttpAdapter().getInstance();
    return serverlessExpress({ app: expressApp });
  } catch (err) {
    console.log('Uncaught exception! Shutting down...');
    console.log(err.name, err.message);
    console.log(err);

    process.exit(1);
  }
}

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback
) => {
  server = server ?? (await serverlessBootstrap());
  return server(event, context, callback);
};
