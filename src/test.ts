// import { API_KEY, JWT_SECRET } from "./configs";
import { Hono } from "hono";

export const testApp = new Hono();

testApp.get('/test', async (c) => {
  console.log({
    // JWT_SECRET,
    // API_KEY
  });
  
  return c.json({
    isTestEndPoint: true,
    message: 'Testing!'
  }, 200);
});
