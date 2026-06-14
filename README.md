# UI/UX Designer Portfolio

A modern, dark-themed portfolio built with React.

## Tech Stack
- React (Create React App)
- Plain CSS (no Tailwind needed — custom design system)
- @fontsource/playfair-display + inter
- Lucide React icons

## Local Development
```bash
npm install
npm start
```

## Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option 2: Vercel Dashboard (recommended)
1. Push this project to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Framework preset: **Create React App**
5. Click **Deploy**

## Customizing Your Portfolio
- **Your name & email**: Search for `Your Name` and `hello@yourname.com` in `src/App.js`
- **Projects**: Edit the `projects` array in `src/App.js`
- **Stats**: Edit the numbers in the About section
- **Social links**: Update the footer links
- **Resume**: Replace `public/resume.pdf` with your actual PDF
- **Colors**: All CSS variables are in `src/index.css` under `:root`

## Resume
Place your resume PDF at `public/resume.pdf` — the Download button is already wired up.
