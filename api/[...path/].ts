import { createServer } from '../../server/index';

export default async function handler(req: any, res: any) {
  const app = createServer();
  
  // Handle the request through Express
  return new Promise((resolve) => {
    app(req, res, () => {
      resolve();
    });
  });
}

