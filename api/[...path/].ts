import { createServer } from '../../server/index';

const app = createServer();

export default async function handler(req: any, res: any) {
  // Let Express handle the request
  return new Promise((resolve, reject) => {
    app(req, res, (err?: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(undefined);
      }
    });
  });
}

