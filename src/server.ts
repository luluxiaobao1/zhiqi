import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

const dev = process.env.COZE_PROJECT_ENV !== 'PROD';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '5000', 10);
const basePath = '/zhiqi';

// Redirect map: paths without basePath -> paths with basePath
const redirectMap: Record<string, string> = {
  '/admin': `${basePath}/admin`,
  '/accountadmin': `${basePath}/accountadmin`,
  '/login': `${basePath}/login`,
  '/console': `${basePath}/console`,
  '/product': `${basePath}/product`,
};

// Create Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      const pathname = parsedUrl.pathname || '';

      // Handle redirects for paths without basePath
      const redirectTarget = redirectMap[pathname] || redirectMap[pathname.replace(/\/$/, '')];
      if (redirectTarget) {
        res.writeHead(308, { Location: redirectTarget });
        res.end();
        return;
      }

      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  });
  server.once('error', err => {
    console.error(err);
    process.exit(1);
  });
  server.listen(port, () => {
    console.log(
      `> Server listening at http://${hostname}:${port} as ${
        dev ? 'development' : process.env.COZE_PROJECT_ENV
      }`,
    );
  });
});
