# E-consultaion

A Vite + React + TypeScript app.

## Quick start

1. Install Node.js 18+.
2. Install dependencies:

```bash
npm ci
```

3. Configure environment variables. Create a file named `.env.local` in the project root with:

```bash
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

See `.env.example` for the required keys.

4. Start the dev server:

- On Windows PowerShell, run commands separately (no `&&`):

```powershell
npm run dev
```

The app will be available at `http://localhost:5173`.

## Build and preview

```bash
npm run build
npm run preview -- --host --port 5173
```

## Notes
- Supabase auth requires valid `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Without them, auth features will not work.
- This project uses TailwindCSS; styles are in `src/index.css` and `tailwind.config.js`.

##Backend
-BAckend Files are compressed together in a zip file named as Backend.zip in main branch.
