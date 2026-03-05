import { createServer } from '../../server/index';

export default async function handler(req: any, res: any) {
  const app = createServer();

  // Pass the request to Express app
  app(req, res);
}

export const config = {
  api: {
    bodyParser: true,
  },
};

