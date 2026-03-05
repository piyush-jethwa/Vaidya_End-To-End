import { createServer } from "./index";
import serverless from "serverless-http";
import express from "express";

// Create Express app
const app = createServer();

// Export handler for Vercel
export default serverless(app, {
  provider: 'aws'
});

