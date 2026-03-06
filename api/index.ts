import { createServer } from '../server/index';

let app: any;

function getApp() {
  if (!app) {
    app = createServer();
  }
  return app;
}

export default async function handler(req: any, res: any) {
  try {
    const server = getApp();
    
    // Let Express handle the request
    return new Promise((resolve, reject) => {
      server(req, res, (err?: any) => {
        if (err) {
          console.error('Express error:', err);
          if (!res.headersSent) {
            res.status(500).json({ error: 'Internal server error' });
          }
          resolve(undefined);
        } else {
          resolve(undefined);
        }
      });
    });
  } catch (error: any) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      error: 'Function error',
      message: error.message || 'Unknown error'
    });
  }
}
