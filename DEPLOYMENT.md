# Deployment Guide: Vercel (Frontend) + Render (Backend) + Neon (Database)

## Prerequisites
- GitHub account with project pushed to a repository
- Vercel account (vercel.com)
- Render account (render.com)
- Neon account with database already created
- Your Neon DATABASE_URL ready

## Step 1: Deploy Backend to Render

### Option A: Using Render Dashboard (Recommended)

1. Go to [render.com](https://render.com)
2. Sign up / Log in
3. Click **New** → **Web Service**
4. Connect GitHub and select your repository
5. Fill in the form:
   - **Name**: `student-data-backend` (or your choice)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free tier

6. Click **Advanced** and add Environment Variables:
   - **Key**: `DATABASE_URL`
   - **Value**: Paste your Neon connection URL
     ```
     postgresql://neondb_owner:npg_hHFs0rI2DURt@ep-floral-dawn-aolzar7i-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
     ```

7. Click **Create Web Service** and wait for deployment (~2-3 min)
8. Once deployed, you'll get a URL like: `https://student-data-backend.onrender.com`
9. **Copy this backend URL** — you'll need it for the frontend

### Option B: Deploy with render.yaml (CLI)

```bash
# Install Render CLI
npm install -g render-cli

# Authenticate
render login

# Deploy from project root
render deploy --render-yaml BACKEND/render.yaml
```

---

## Step 2: Deploy Frontend to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Sign up / Log in
3. Click **Add New** → **Project**
4. Import GitHub repository
5. Select the **frontend** folder as root directory
6. Click **Configure Project** and set:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`

7. Add Environment Variables:
   - **Key**: `REACT_APP_API_BASE`
   - **Value**: Your Render backend URL (from Step 1)
     ```
     https://student-data-backend.onrender.com/api/datapath
     ```

8. Click **Deploy**
9. Once deployed, you'll get a URL like: `https://your-project.vercel.app`

### Option B: Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# From project root
vercel --prod

# When prompted, link to existing project or create new one
# Set environment variables when prompted
```

---

## Step 3: Update CORS in Backend (if needed)

If frontend can't reach backend, update `BACKEND/server.js`:

```javascript
app.use(cors({
  origin: 'https://your-project.vercel.app',
  credentials: true
}));
```

Replace `https://your-project.vercel.app` with your actual Vercel frontend URL.

---

## Step 4: Verify Deployment

1. Open your Vercel frontend URL
2. Try Add, Edit, Update, Delete operations
3. Check browser console (F12) for errors
4. If CORS errors appear, update the backend CORS settings

---

## Troubleshooting

### "Unable to fetch records" or CORS errors
- Check backend CORS configuration
- Verify `REACT_APP_API_BASE` environment variable in Vercel
- Backend logs on Render: click your service → **Logs** tab

### "Unable to connect to database"
- Verify `DATABASE_URL` environment variable is set on Render
- Check Neon connection string is correct
- Ensure SSL mode is set properly in the URL

### "Cannot find module 'pg'" or similar
- Backend needs to run `npm install` before starting
- Verify `render.yaml` has correct `buildCommand`

---

## Final URLs After Deployment

- **Frontend**: `https://your-project.vercel.app`
- **Backend API**: `https://student-data-backend.onrender.com`
- **Database**: Neon (no public URL needed, accessed by backend only)

---

## Local Development (After Deployment)

To continue developing locally:

```bash
# Terminal 1: Backend
cd BACKEND
npm start

# Terminal 2: Frontend
cd frontend
npm start
```

Both services will use `.env` files for local configuration.
