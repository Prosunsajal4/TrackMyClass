# Smart Attendance Predictor

A modern, full-stack attendance management and prediction system with AI-powered insights. Track attendance for Section A and Section B separately, automatically calculate attendance marks out of 10, and get intelligent predictions about your attendance trends.

## 🚀 Features

### Authentication

- User registration and login
- JWT-based authentication
- Persistent login sessions
- Secure password hashing with bcrypt

### Dashboard

- Overall attendance statistics
- Total courses overview
- Attendance marks summary
- Risk warning indicators
- Interactive charts (Doughnut & Bar)
- AI-powered attendance predictions
- Recent courses list

### Course Management

- Add new courses
- Edit existing courses
- Delete courses
- Search and filter courses
- Real-time statistics

### Attendance Tracking

- Separate tracking for Section A and Section B
- Clickable attendance boxes (30 classes per section)
- Tick/untick attendance with smooth animations
- Real-time updates
- Auto-save to MongoDB
- Visual indicators (green for attended, gray for absent)

### Attendance Calculation

- Section A = 5 marks
- Section B = 5 marks
- Total = 10 marks
- Percentage-based mark calculation
- Overall attendance percentage
- Risk level assessment (high/medium/low)
- Safe absences calculation

### AI Predictions

- Future attendance prediction
- Intelligent suggestions
- Risk warnings
- Classes needed to reach target percentage
- Trend analysis (stable/declining/critical)

### Analytics

- Section comparison charts
- Marks visualization
- Attendance radar chart
- Course-wise analytics table
- Average statistics

### UI/UX

- Glassmorphism design
- Dark/Light mode toggle
- Responsive design
- Smooth animations
- Toast notifications
- Modern gradient backgrounds
- Beautiful card layouts

### Extra Features

- Search courses
- Filter functionality
- Export attendance report as PDF
- Auto-save changes
- Real-time calculations
- Editable attendance anytime

## 🛠 Tech Stack

### Frontend

- **Next.js 14** - React framework
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualization
- **React Chart.js 2** - Chart components
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **jsPDF** - PDF generation
- **Lucide React** - Icons

### Backend

- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
TrackMyClass/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   ├── courseController.js # Course logic
│   │   └── userController.js  # User logic
│   ├── middleware/
│   │   └── auth.js            # JWT middleware
│   ├── models/
│   │   ├── User.js            # User model
│   │   └── Course.js          # Course model
│   ├── routes/
│   │   ├── authRoutes.js      # Auth routes
│   │   ├── courseRoutes.js    # Course routes
│   │   ├── attendanceRoutes.js # Attendance routes
│   │   └── userRoutes.js      # User routes
│   ├── utils/
│   │   ├── generateToken.js   # JWT token generation
│   │   └── prediction.js      # AI prediction logic
│   ├── .env                   # Environment variables
│   ├── package.json           # Dependencies
│   └── server.js              # Entry point
│
├── frontend/
│   ├── app/
│   │   ├── analytics/
│   │   │   └── page.js        # Analytics page
│   │   ├── courses/
│   │   │   ├── [id]/
│   │   │   │   └── page.js    # Course detail page
│   │   │   └── page.js        # Courses list page
│   │   ├── dashboard/
│   │   │   └── page.js        # Dashboard page
│   │   ├── login/
│   │   │   └── page.js        # Login page
│   │   ├── register/
│   │   │   └── page.js        # Register page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.js          # Root layout
│   │   └── page.js            # Home page
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.js      # Header component
│   │   │   ├── ProtectedRoute.js # Auth wrapper
│   │   │   └── Sidebar.js     # Sidebar component
│   ├── context/
│   │   ├── AuthContext.js     # Authentication context
│   │   └── ThemeContext.js    # Theme context
│   ├── services/
│   │   └── api.js             # API service
│   ├── utils/
│   │   └── cn.js              # Utility function
│   ├── .env.local             # Environment variables
│   ├── next.config.js         # Next.js config
│   ├── package.json           # Dependencies
│   ├── postcss.config.js      # PostCSS config
│   └── tailwind.config.js     # Tailwind config
│
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (installed and running)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd TrackMyClass
   ```

2. **Install Backend Dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Configure Backend Environment**

   Create a `.env` file in the `backend` directory:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/attendance-predictor
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   JWT_EXPIRE=7d
   ```

4. **Start MongoDB**

   ```bash
   # Make sure MongoDB is running
   # On Windows: Start MongoDB service
   # On Mac/Linux: sudo mongod
   ```

5. **Start Backend Server**

   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

6. **Install Frontend Dependencies**

   ```bash
   cd ../frontend
   npm install
   ```

7. **Configure Frontend Environment**

   The `.env.local` file is already configured:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

8. **Start Frontend Development Server**

   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

9. **Open the Application**

   Navigate to `http://localhost:3000` in your browser.

## 📱 Usage

1. **Register**: Create a new account with your name, email, and password
2. **Login**: Sign in with your credentials
3. **Dashboard**: View your overall attendance statistics and AI predictions
4. **Add Course**: Click "Add Course" to create a new course
5. **Track Attendance**: Click on a course to open attendance tracking
6. **Toggle Attendance**: Click on class boxes to mark attendance (green) or absence (gray)
7. **View Analytics**: Check the Analytics page for detailed charts and statistics
8. **Export PDF**: Download attendance reports as PDF

## 🎨 Attendance Calculation Logic

### Marks System

- **Section A**: 5 marks (based on attendance percentage)
- **Section B**: 5 marks (based on attendance percentage)
- **Total**: 10 marks

### Calculation Example

```
Section A: 80% attendance → 4/5 marks
Section B: 60% attendance → 3/5 marks
Total: 4 + 3 = 7/10 marks
```

### Risk Levels

- **High Risk**: Below 60% attendance
- **Medium Risk**: 60% - 75% attendance
- **Low Risk**: Above 75% attendance

### Safe Absences

Calculated based on maintaining 75% overall attendance:

```
Safe Absences = Current Attended - Required Attended for 75%
Required Attended for 75% = ceil(Total Classes × 0.75)
```

## 🔐 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Courses

- `GET /api/courses` - Get all courses (protected)
- `POST /api/courses` - Create course (protected)
- `GET /api/courses/:id` - Get course by ID (protected)
- `PUT /api/courses/:id` - Update course (protected)
- `DELETE /api/courses/:id` - Delete course (protected)
- `PUT /api/courses/:id/attendance` - Update attendance (protected)

### User

- `GET /api/user/dashboard` - Get dashboard stats (protected)
- `GET /api/user/analytics` - Get analytics data (protected)

## 🌙 Dark Mode

The application supports dark mode. Toggle between light and dark themes using the moon/sun icon in the header.

## 📄 PDF Export

Export your attendance reports as PDF by clicking the "Export PDF" button on the course detail page.

## 🔮 AI Predictions

The application provides intelligent predictions:

- Future attendance percentage
- Classes needed to reach target percentage
- Risk warnings
- Safe absences calculation
- Section-specific recommendations

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running
- Check the MONGODB_URI in `.env`
- Verify MongoDB is accessible on the specified port

### CORS Errors

- Ensure the backend is running on port 5000
- Check NEXT_PUBLIC_API_URL in frontend `.env.local`

### Build Errors

- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear Next.js cache: `rm -rf .next`

## 📝 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Built with ❤️ using Next.js, Express.js, and MongoDB

---

## 🚀 Quick Deployment Guide

### Recommended Setup: Frontend on Vercel + Backend on Render

#### Step 1: Deploy Backend to Render (5 minutes)

1. Push backend code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo (backend folder)
4. Configure:
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Generate a strong secret
   - `JWT_EXPIRE`: 7d
   - `FRONTEND_URL`: Your Vercel URL (add after frontend deployment)
   - `NODE_ENV`: production
6. Click Deploy → Copy the backend URL

#### Step 2: Set up MongoDB Atlas (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster → Create database user
3. Network Access → Add IP: `0.0.0.0/0`
4. Get connection string

#### Step 3: Deploy Frontend to Vercel (3 minutes)

1. Push frontend code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Configure:
   - Root Directory: `frontend`
   - Framework: Next.js
5. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: Your backend URL from Render
6. Click Deploy

#### Step 4: Update Backend CORS

1. Go to Render dashboard
2. Add `FRONTEND_URL`: Your Vercel URL
3. Redeploy backend

**That's it! Your app is live! 🎉**

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
