import { createServer } from '../server';

export default async function handler(req: any, res: any) {
  const app = createServer();
  return new Promise<void>((resolve, reject) => {
    app(req, res, (err?: any) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
