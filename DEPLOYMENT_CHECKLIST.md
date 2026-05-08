# Deployment Checklist

Use this checklist to ensure everything is ready for deployment.

## Pre-Deployment

### Backend
- [ ] All dependencies are in `package.json`
- [ ] `.env` file is NOT committed to git
- [ ] `.env.example` is updated with all required variables
- [ ] MongoDB connection string is ready (use Atlas for production)
- [ ] JWT_SECRET is strong and unique
- [ ] CORS is configured for production
- [ ] Procfile is created (for Render)
- [ ] `.gitignore` excludes sensitive files

### Frontend
- [ ] All dependencies are in `package.json`
- [ ] `.env.local` is NOT committed to git
- [ ] `.env.production` is created with placeholder
- [ ] Build runs successfully locally (`npm run build`)
- [ ] API URL is configurable via environment variable
- [ ] `.gitignore` excludes sensitive files

### Database
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with strong password
- [ ] IP whitelist configured (0.0.0.0/0 for cloud)
- [ ] Connection string tested locally

## Deployment Steps

### Backend (Render)
- [ ] Backend code pushed to GitHub
- [ ] Render account created
- [ ] New Web Service created
- [ ] GitHub repo connected
- [ ] Build command: `npm install`
- [ ] Start command: `node server.js`
- [ ] Environment variables added:
  - [ ] `PORT`: 5000
  - [ ] `MONGODB_URI`: Atlas connection string
  - [ ] `JWT_SECRET`: Strong random string
  - [ ] `JWT_EXPIRE`: 7d
  - [ ] `NODE_ENV`: production
  - [ ] `FRONTEND_URL`: (add after frontend deployment)
- [ ] Deployment successful
- [ ] Backend URL copied

### Frontend (Vercel)
- [ ] Frontend code pushed to GitHub
- [ ] Vercel account created
- [ ] New project created
- [ ] GitHub repo imported
- [ ] Root directory: `frontend`
- [ ] Framework: Next.js
- [ ] Environment variable added:
  - [ ] `NEXT_PUBLIC_API_URL`: Backend URL from Render
- [ ] Deployment successful
- [ ] Frontend URL copied

### Post-Deployment
- [ ] Update backend `FRONTEND_URL` with Vercel URL
- [ ] Redeploy backend
- [ ] Test authentication (register/login)
- [ ] Test course creation
- [ ] Test attendance tracking
- [ ] Test PDF export
- [ ] Test dark/light mode
- [ ] Check console for errors
- [ ] Test on mobile device

## Environment Variables Reference

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your_strong_secret_here
JWT_EXPIRE=7d
FRONTEND_URL=https://your-app.vercel.app
NODE_ENV=production
```

### Frontend (.env.production)
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

## Security Checklist

- [ ] No hardcoded credentials in code
- [ ] JWT_SECRET is strong (32+ characters)
- [ ] MongoDB password is strong
- [ ] HTTPS is enabled (automatic on Vercel/Render)
- [ ] CORS is restricted to frontend URL
- [ ] Environment variables are not exposed
- [ ] .env files are in .gitignore

## Performance Checklist

- [ ] Images optimized (if any)
- [ ] Bundle size checked
- [ ] No console.log in production (optional)
- [ ] Error handling in place
- [ ] Loading states implemented

## Monitoring

- [ ] Vercel analytics enabled
- [ ] Render logs monitored
- [ ] MongoDB Atlas metrics checked
- [ ] Error tracking set up (optional)

## Domain Configuration (Optional)

- [ ] Custom domain purchased
- [ ] DNS configured for Vercel
- [ ] DNS configured for Render (if needed)
- [ ] SSL certificates verified

## Backup & Recovery

- [ ] MongoDB backup schedule configured
- [ ] Code backed up on GitHub
- [ ] Recovery plan documented

---

## Quick Commands

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Test Backend Locally
```bash
cd backend
npm install
npm run dev
```

### Test Frontend Locally
```bash
cd frontend
npm install
npm run dev
```

### Build Frontend
```bash
cd frontend
npm run build
npm start
```

---

## Common Issues & Solutions

### MongoDB Connection Error
- Check IP whitelist in Atlas
- Verify connection string format
- Ensure database user has correct permissions

### CORS Error
- Update `FRONTEND_URL` in backend
- Redeploy backend after changes
- Check environment variables are set

### Build Failures
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for syntax errors in code
- Review build logs

### API Not Working
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend is running
- Test API endpoints directly
- Check browser console for errors

---

## Support Links

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Next.js Deployment: https://nextjs.org/docs/deployment
