const path = require('path');
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// Gzip/deflate compression for faster asset delivery
app.use(compression());

// Basic security headers, relaxed enough for inline <style>/<script> and
// the fonts.googleapis.com stylesheet + Google Fonts + Formspree fetch()
// used by the existing page — nothing about the page's behavior changes.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
        mediaSrc: ["'self'", 'data:'],
        connectSrc: ["'self'", 'https://formspree.io'],
        formAction: ["'self'", 'https://formspree.io'],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Serve every file in /public exactly as it is (html, css/js inline in
// index.html, images, svgs, video) with sensible caching for static assets.
app.use(
  express.static(PUBLIC_DIR, {
    extensions: ['html'],
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        // Always revalidate the HTML so deploys show up immediately
        res.setHeader('Cache-Control', 'no-cache');
      } else {
        // Long cache for images/video/svg/etc.
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    },
  })
);

// Simple health check endpoint (handy for uptime checks / hosting platforms)
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Fallback: send index.html for any other GET request (keeps behavior of
// a plain static single-page site; e.g. hitting "/" or an unknown path)
app.get('*', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Scalable Technologies site running at http://localhost:${PORT}`);
});
