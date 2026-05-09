# TrackMyClass - Smart Attendance Management System

A modern, full-stack attendance management and prediction system with AI-powered insights and chat assistance. Track attendance for Section A and Section B separately, automatically calculate attendance marks out of 10, and get intelligent predictions about your attendance trends.

## 🌐 Live Demo

**🚀 [TrackMyClass - Live Application](https://classattendencetracker.vercel.app)**

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

### AI Chat Assistant

- Intelligent attendance assistant powered by Google Gemini 2.5
- Get help with attendance calculations
- Study tips and time management advice
- Academic guidance and predictions
- 24/7 availability with contextual responses

### Attendance Calculation

- Section A = 5 marks
- Section B = 5 marks
- Total = 10 marks
- Percentage-based mark calculation
- Overall attendance percentage
- Risk level assessment (high/medium/low)
- Safe absences calculation

### AI Features

- **AI Chat Assistant**: Get personalized help with attendance questions
- **Future attendance prediction**: Intelligent trend analysis
- **Intelligent suggestions**: Study tips and academic advice
- **Risk warnings**: Early alerts for attendance issues
- **Classes needed calculation**: To reach target percentage
- **Trend analysis**: Stable/declining/critical status

### Analytics

- Section comparison charts
- Marks visualization
- Attendance radar chart
- Course-wise analytics table
- Average statistics

### Accessibility Features

- **WCAG 2.1 AA Compliant**: Full accessibility support
- **Keyboard Navigation**: Skip links and focus management
- **Screen Reader Support**: ARIA labels and announcements
- **High Contrast**: Dark/light mode toggle
- **Semantic HTML**: Proper heading structure and landmarks

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

### Frontend & Backend

- **Next.js 14** - Full-stack React framework with App Router
- **React 18** - UI library with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Data visualization library
- **React Chart.js 2** - Chart components
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Notification system
- **Google Gemini AI** - AI chat functionality
- **jsPDF** - PDF generation
- **Lucide React** - Modern icon library

### Database & Infrastructure

- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Bcrypt.js** - Password hashing
- **Vercel** - Serverless deployment platform
- **Vercel Serverless Functions** - API routes (backend logic)

## 📁 Project Structure

```
TrackMyClass/
├── frontend/                          # Next.js Application
│   ├── app/                           # Next.js App Router
│   │   ├── analytics/
│   │   │   └── page.js                # Analytics dashboard
│   │   ├── api/                       # API Routes (Serverless Functions)
│   │   │   ├── auth/                  # Authentication endpoints
│   │   │   │   ├── login/route.js
│   │   │   │   ├── profile/route.js
│   │   │   │   └── register/route.js
│   │   │   ├── chat/route.js          # AI chat endpoint
│   │   │   ├── courses/               # Course management
│   │   │   │   ├── [id]/route.js
│   │   │   │   └── route.js
│   │   │   ├── db.js                  # Database connection
│   │   │   ├── diag/route.js          # Diagnostic endpoint
│   │   │   ├── models/                # Database models
│   │   │   │   ├── Course.js
│   │   │   │   └── User.js
│   │   │   └── user/                  # User endpoints
│   │   │       ├── analytics/route.js
│   │   │       └── dashboard/route.js
│   │   ├── chat/
│   │   │   └── page.js                # AI chat interface
│   │   ├── courses/
│   │   │   ├── [id]/
│   │   │   │   └── page.js            # Course detail page
│   │   │   └── page.js                # Courses list page
│   │   ├── dashboard/
│   │   │   └── page.js                # Main dashboard
│   │   ├── login/
│   │   │   └── page.js                # Login page
│   │   ├── register/
│   │   │   └── page.js                # Registration page
│   │   ├── globals.css                # Global styles
│   │   ├── layout.js                  # Root layout
│   │   ├── page.js                    # Home page
│   │   └── Providers.js               # React context providers
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.js              # Navigation header
│   │   │   ├── Layout.js              # Main layout wrapper
│   │   │   ├── ProtectedRoute.js      # Auth protection
│   │   │   └── Sidebar.js             # Navigation sidebar
│   │   └── courses/                   # Course-specific components
│   ├── context/
│   │   ├── AuthContext.js             # Authentication state
│   │   └── ThemeContext.js            # Theme state
│   ├── public/                        # Static assets
│   ├── services/
│   │   └── api.js                     # API client
│   ├── utils/
│   │   └── cn.js                      # Utility functions
│   ├── .env.local                     # Local environment variables
│   ├── .env.production                # Production environment variables
│   ├── next.config.js                 # Next.js configuration
│   ├── package.json                   # Dependencies
│   ├── postcss.config.js              # PostCSS configuration
│   ├── tailwind.config.js             # Tailwind configuration
│   └── vercel.json                    # Vercel deployment config
│
├── backend/                           # Legacy backend (not used in production)
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── package.json
│   ├── Procfile
│   └── server.js
│
├── DEPLOYMENT.md                      # Detailed deployment guide
├── DEPLOYMENT_CHECKLIST.md            # Deployment checklist
├── pa11y-report.json                  # Accessibility audit report
├── vercel.json                        # Vercel configuration
└── README.md                          # This file
```
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
- npm or yarn
- Git

### Quick Start (Live Demo)

The easiest way to try TrackMyClass is through our live demo:

1. **Visit**: [https://classattendencetracker.vercel.app](https://classattendencetracker.vercel.app)
2. **Register**: Create a new account
3. **Start Tracking**: Add courses and track attendance

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/Prosunsajal4/TrackMyClass.git
   cd TrackMyClass
   ```

2. **Install Dependencies**

   ```bash
   cd frontend
   npm install
   ```

3. **Configure Environment Variables**

   Create `.env.local` in the `frontend` directory:

   ```env
   MONGODB_URI=mongodb+srv://your-mongodb-atlas-connection-string
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   GEMINI_API_KEY=your-gemini-api-key
   ```

4. **Start Development Server**

   ```bash
   npm run dev
   ```

5. **Open the Application**

   Navigate to `http://localhost:3000` in your browser.

### Database Setup

TrackMyClass uses **MongoDB Atlas** (free cloud database):

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Configure network access (allow all IPs: `0.0.0.0/0`)
5. Get your connection string and add it to `.env.local`

## 📱 Usage

1. **Register**: Create a new account with your name, email, and password
2. **Login**: Sign in with your credentials
3. **Dashboard**: View your overall attendance statistics and AI predictions
4. **Add Course**: Click "Add Course" to create a new course
5. **Track Attendance**: Click on a course to open attendance tracking
6. **Toggle Attendance**: Click on class boxes to mark attendance (green) or absence (gray)
7. **AI Chat Assistant**: Click the chat icon to get help with attendance questions
8. **View Analytics**: Check the Analytics page for detailed charts and statistics
9. **Export PDF**: Download attendance reports as PDF

### AI Chat Features

- Ask questions about attendance calculations
- Get study tips and time management advice
- Receive academic guidance and predictions
- Get help with course planning and scheduling
- Understand attendance requirements and policies

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

All API endpoints are serverless functions deployed on Vercel:

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Courses

- `GET /api/courses` - Get all courses (protected)
- `POST /api/courses` - Create course (protected)
- `GET /api/courses/[id]` - Get course by ID (protected)
- `PUT /api/courses/[id]` - Update course (protected)
- `DELETE /api/courses/[id]` - Delete course (protected)
- `PUT /api/courses/[id]/attendance` - Update attendance (protected)

### User

- `GET /api/user/dashboard` - Get dashboard stats (protected)
- `GET /api/user/analytics` - Get analytics data (protected)

### AI Chat

- `POST /api/chat` - AI chat assistant (protected)
- `GET /api/diag` - Diagnostic information

## 🌙 Dark Mode

The application supports dark mode. Toggle between light and dark themes using the moon/sun icon in the header.

## 📄 PDF Export

Export your attendance reports as PDF by clicking the "Export PDF" button on the course detail page.

## 🔮 AI Features

### AI Chat Assistant
- **Powered by Google Gemini 2.5**: Advanced AI for attendance guidance
- **Contextual Help**: Answers questions about attendance calculations
- **Study Tips**: Personalized advice for improving attendance
- **Academic Guidance**: Time management and study strategies
- **24/7 Availability**: Always ready to help with attendance questions

### Smart Predictions
- **Future Attendance Forecasting**: Predict attendance trends
- **Risk Assessment**: Early warnings for attendance issues
- **Target Calculations**: Classes needed to reach specific percentages
- **Safe Absences**: Maximum absences while maintaining requirements
- **Trend Analysis**: Stable/declining/critical status monitoring

### Intelligent Insights
- **Section-wise Analysis**: Compare Section A vs Section B performance
- **Course Recommendations**: Suggestions for course planning
- **Performance Optimization**: Tips to improve attendance marks

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

## 🚀 Deployment

TrackMyClass is deployed on **Vercel** with serverless functions. The application is fully serverless - no separate backend needed!

### Current Deployment Status

- ✅ **Frontend**: Deployed on Vercel
- ✅ **Backend**: Serverless functions (Next.js API routes)
- ✅ **Database**: MongoDB Atlas
- ✅ **AI Chat**: Google Gemini API integration
- ✅ **Live URL**: https://classattendencetracker.vercel.app

### Quick Deployment (Vercel)

1. **Fork/Clone** this repository
2. **Connect to Vercel**: Go to [vercel.com](https://vercel.com) → New Project
3. **Import GitHub repo** and select this project
4. **Configure**:
   - Root Directory: `frontend`
   - Framework: Next.js
5. **Add Environment Variables**:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Strong random string (generate one)
   - `JWT_EXPIRE`: 7d
   - `GEMINI_API_KEY`: Your Google Gemini API key
6. **Deploy**: Click "Deploy"

**That's it! Your app will be live in minutes! 🎉**

### Environment Variables Required

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-super-secure-random-jwt-secret-key
JWT_EXPIRE=7d
GEMINI_API_KEY=AIzaSy...your-gemini-api-key
```

### Database Setup

1. Create [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
2. Create free cluster and database
3. Add connection string to environment variables
4. Configure network access: `0.0.0.0/0`

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Issues**
- Ensure MongoDB Atlas connection string is correct
- Check network access settings (allow `0.0.0.0/0`)
- Verify database user credentials

**AI Chat Not Working**
- Check `GEMINI_API_KEY` environment variable
- Ensure API key has Gemini API access enabled
- Verify billing/quota status in Google Cloud Console

**Build Errors**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear Next.js cache: `rm -rf .next`

**Environment Variables**
- All required variables must be set in Vercel dashboard
- Restart deployment after adding new variables

## 📝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/Prosunsajal4/TrackMyClass/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Prosunsajal4/TrackMyClass/discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using Next.js, MongoDB, and Google Gemini AI**

**Live Demo**: [https://classattendencetracker.vercel.app](https://classattendencetracker.vercel.app)

*Last updated: May 2026*
