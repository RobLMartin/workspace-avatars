// Vercel serverless function for React Router v7
export default async function handler(req, res) {
  const { createRequestHandler } = await import("@react-router/node");
  const build = await import("../build/server/index.js");

  const requestHandler = createRequestHandler({
    build,
    mode: process.env.NODE_ENV || "production"
  });

  return requestHandler(req, res);
}
