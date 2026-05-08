# Deployment Guide

This guide will help you deploy the Smart Attendance Predictor application.

## 🚀 Deployment Options

### Option 1: Frontend on Vercel + Backend on Render (Recommended)

This is the easiest and most cost-effective option.

#### Backend Deployment (Render)

1. **Push your backend code to GitHub**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - Sign up/login
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository
   - Select the `backend` folder (or create a separate repo for backend)
   - Configure:
     - **Name**: attendance-predictor-backend
     - **Runtime**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `node server.js`
   - Add Environment Variables:
     - `PORT`: 5000
     - `MONGODB_URI`: Your MongoDB connection string (use MongoDB Atlas for free)
     - `JWT_SECRET`: Generate a strong random string
     - `JWT_EXPIRE`: 7d
   - Click "Deploy Web Service"
   - Copy the deployed URL (e.g., `https://attendance-predictor-backend.onrender.com`)

3. **Update MongoDB Atlas (Recommended for Production)**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Create a database user
   - Whitelist IP addresses (0.0.0.0/0 for Render)
   - Get your connection string
   - Update `MONGODB_URI` in Render with your Atlas connection string

#### Frontend Deployment (Vercel)

1. **Push your frontend code to GitHub**
   ```bash
   cd frontend
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Next.js
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`
   - Add Environment Variables:
     - `NEXT_PUBLIC_API_URL`: Your backend URL from Render (e.g., `https://attendance-predictor-backend.onrender.com`)
   - Click "Deploy"
   - Wait for deployment to complete

3. **Your app is live!**
   - Vercel will provide a URL (e.g., `https://your-app.vercel.app`)

---

### Option 2: Frontend on Vercel + Backend on Railway

Similar to Render, Railway is another great option for hosting Node.js backends.

1. **Deploy Backend to Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up/login
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your backend repository
   - Add environment variables (same as Render)
   - Railway will automatically deploy
   - Copy the generated URL

2. **Deploy Frontend to Vercel**
   - Follow the same steps as Option 1
   - Use Railway URL for `NEXT_PUBLIC_API_URL`

---

### Option 3: Full Stack on Vercel (Advanced)

To deploy both frontend and backend on Vercel, you need to convert the Express backend to Vercel Serverless Functions.

1. **Restructure backend for Vercel**
   - Create `api/` folder in your project root
   - Move your Express routes to individual serverless functions
   - This requires significant refactoring

2. **Use the following structure:**
   ```
   /api
     /auth
       /register.js
       /login.js
     /courses
       /index.js
       /[id].js
   ```

*Note: This approach is more complex and may have limitations. Option 1 is recommended.*

---

### Option 4: Backend on Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku app**
   ```bash
   cd backend
   heroku create attendance-predictor-backend
   ```

4. **Set environment variables**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set JWT_EXPIRE=7d
   heroku config:set PORT=5000
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **Get the URL**
   ```bash
   heroku apps:info --app attendance-predictor-backend
   ```

7. **Deploy frontend to Vercel** (same as Option 1)

---

## 📋 MongoDB Atlas Setup (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Build a free cluster (M0)
4. Create a database user:
   - Username: Your choice
   - Password: Strong password
5. Network Access:
   - Add IP: `0.0.0.0/0` (allows all IPs for cloud deployment)
6. Get Connection String:
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/attendance-predictor?retryWrites=true&w=majority
```

---

## 🔧 Environment Variables Summary

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/attendance-predictor
JWT_SECRET=your_strong_random_secret_key
JWT_EXPIRE=7d
```

### Frontend (.env.production)
```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

---

## ✅ Pre-Deployment Checklist

- [ ] Push code to GitHub
- [ ] Set up MongoDB Atlas database
- [ ] Configure environment variables in hosting platform
- [ ] Test backend API endpoints
- [ ] Update frontend API URL
- [ ] Remove any hardcoded credentials
- [ ] Set up proper CORS origins
- [ ] Test the deployed application

---

## 🌐 Domain Configuration (Optional)

### Vercel Custom Domain
1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Render Custom Domain
1. Go to Render service settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records

---

## 🔒 Security Best Practices

1. **Never commit .env files** to git
2. **Use strong JWT secrets** (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
3. **Enable MongoDB authentication**
4. **Use HTTPS only** (automatic on Vercel/Render)
5. **Set up rate limiting** for API endpoints
6. **Implement input validation** (already included with express-validator)

---

## 📊 Monitoring

### Vercel Analytics
- Automatically enabled for deployments
- View visitor stats, performance metrics

### Render Logs
- View real-time logs in Render dashboard
- Monitor server health

---

## 🔄 CI/CD

Both Vercel and Render provide automatic deployments:
- Push to GitHub → Automatic deployment
- Pull requests → Preview deployments
- Branch-based deployments

---

## 💡 Troubleshooting

### Backend Deployment Issues
- Check logs in hosting platform dashboard
- Verify environment variables are set correctly
- Ensure MongoDB connection string is correct
- Check if PORT is properly configured

### Frontend Deployment Issues
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check Vercel deployment logs
- Ensure build command succeeds locally first
- Clear cache and redeploy if needed

### CORS Issues
- Update CORS origin in backend to include your frontend URL
- Add your Vercel domain to allowed origins

---

## 📞 Support

For deployment issues:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Render: [render.com/docs](https://render.com/docs)
- Railway: [docs.railway.app](https://docs.railway.app)
- MongoDB Atlas: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
