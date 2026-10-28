export default async function handler(req: any, res: any) {
  try {
    const serverModule = await import('../server/index');
    const app = serverModule.default || serverModule.app;
    return app(req, res);
  } catch (error: any) {
    console.error('Serverless API Error:', error);
    res.status(500).json({
      error: 'Serverless invocation error',
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
    });
  }
}
