import serverless from 'serverless-http';
import { createServer } from '../../server/index';

const app = createServer();
const handler = serverless(app);

export default handler;

export const config = {
  api: {
    bodyParser: true,
  },
};

