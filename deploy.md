# Deployment Guide (Vercel + Render)

## 1. Backend Deployment (Render)

1. Ensure your MongoDB Atlas connection is active.
2. Go to **Render** and create a new **Web Service**.
3. Connect your GitHub repository containing the `Expense_Backend`.
4. Setup settings:
   - **Root Directory**: `./Expense_Backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   FRONTEND_URL=https://your-vercel-frontend.vercel.app
   ```
6. Click deploy. Render will automatically install dependencies and start `nodemon` or `node src/index.js`. It may take a minute or two for the server to spin up.

## 2. Frontend Deployment (Vercel)

1. Go to **Vercel** and select **Add New Project**.
2. Connect the same GitHub repository.
3. Vercel should auto-detect Vite. Use the following overrides:
   - **Framework Preset**: Vite
   - **Root Directory**: `./Expense_Frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables**:
   ```
   VITE_API_URL=https://your-render-backend-url.onrender.com/api/v1
   ```
5. Click deploy. Your Vercel link will now point exactly to the new Render backend.

> [!NOTE]
> Make sure that `FRONTEND_URL` on Render exactly matches your Vercel URL so that CORS policies allow requests.
