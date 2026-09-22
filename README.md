# Scalable Technologies — Node.js site

This is your original site (`index.html` + images/SVGs/video), unchanged,
now served by a small Express (Node.js) server so it can be deployed
anywhere that runs Node.

Nothing in the frontend was modified — same HTML, same inline CSS/JS, same
contact form (still posts to your existing Formspree endpoint, exactly as
before). The only addition is `server.js`, which serves the `public/`
folder as static files.

## Project structure

```
.
├── public/              # your original site, unchanged
│   ├── index.html
│   ├── logo-full.png
│   ├── logo-icon.png
│   ├── bg-*.jpg
│   ├── *.svg
│   └── video.mp4
├── server.js            # Express server
├── package.json
├── Procfile              # for Heroku-style platforms
└── .gitignore
```

## Run locally

Requires Node.js 18+ and npm.

```bash
npm install
npm start
```

Then open http://localhost:3000

The port can be overridden with the `PORT` environment variable
(most hosting platforms set this automatically).

## Deploy

This is a standard Node/Express app, so it deploys the same way on most
platforms:

### Render / Railway / Heroku-style platforms
1. Push this folder to a Git repo.
2. Create a new "Web Service" (Render) or app (Railway/Heroku).
3. Build command: `npm install`
4. Start command: `npm start` (or Heroku picks up the included `Procfile`
   automatically).
5. Deploy — no other config is required.

### VPS (e.g. DigitalOcean, EC2)
```bash
git clone <your-repo>
cd <repo>
npm install --production
npm start
```
Use a process manager like `pm2` to keep it running:
```bash
npm install -g pm2
pm2 start server.js --name scalable-technologies
pm2 save
```
Put Nginx in front of it as a reverse proxy to `localhost:3000` for TLS
and a custom domain.

### Docker (optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

## Notes
- The contact form still submits directly to Formspree from the browser
  (`https://formspree.io/f/meaoekzq`), exactly as it did before — no
  backend change was made to it, so no additional setup (email service,
  API keys, etc.) is needed for it to keep working.
- A `/healthz` endpoint is included for uptime checks.
- HTML responses are served with `no-cache` so updates show immediately;
  images/video/SVGs are served with long-term caching for speed.
