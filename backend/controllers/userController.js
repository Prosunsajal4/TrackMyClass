const Course = require('../models/Course');
const { predictFutureAttendance } = require('../utils/prediction');

// @desc    Get user dashboard statistics
// @route   GET /api/user/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const courses = await Course.find({ user: req.user.id });
    
    // Calculate overall statistics
    let totalCourses = courses.length;
    let overallPercentage = 0;
    let totalMarks = 0;
    let totalAttended = 0;
    let totalClasses = 0;
    let highRiskCourses = 0;
    let mediumRiskCourses = 0;
    
    const courseStats = courses.map(course => {
      const stats = course.calculateStats();
      
      overallPercentage += stats.overallPercentage;
      totalMarks += stats.totalMarks;
      totalAttended += stats.totalAttended;
      totalClasses += stats.totalClasses;
      
      if (stats.riskLevel === 'high') highRiskCourses++;
      if (stats.riskLevel === 'medium') mediumRiskCourses++;
      
      return {
        id: course._id,
        courseName: course.courseName,
        stats,
      };
    });
    
    // Calculate averages
    if (totalCourses > 0) {
      overallPercentage = overallPercentage / totalCourses;
      totalMarks = totalMarks / totalCourses;
    }
    
    // Predict future attendance
    const prediction = predictFutureAttendance(
      overallPercentage,
      totalClasses,
      totalAttended,
      5
    );
    
    res.json({
      totalCourses,
      overallPercentage: Math.round(overallPercentage * 10) / 10,
      totalMarks: Math.round(totalMarks * 10) / 10,
      totalAttended,
      totalClasses,
      highRiskCourses,
      mediumRiskCourses,
      lowRiskCourses: totalCourses - highRiskCourses - mediumRiskCourses,
      prediction,
      recentCourses: courseStats.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user analytics data
// @route   GET /api/user/analytics
// @access  Private
const getAnalytics = async (req, res) => {
  try {
    const courses = await Course.find({ user: req.user.id });
    
    const analyticsData = courses.map(course => {
      const stats = course.calculateStats();
      
      return {
        courseName: course.courseName,
        sectionAPercentage: stats.sectionAPercentage,
        sectionBPercentage: stats.sectionBPercentage,
        overallPercentage: stats.overallPercentage,
        totalMarks: stats.totalMarks,
        sectionAMarks: stats.sectionAMarks,
        sectionBMarks: stats.sectionBMarks,
        riskLevel: stats.riskLevel,
        createdAt: course.createdAt,
      };
    });
    
    // Calculate trends
    const sectionAAverage = analyticsData.reduce((sum, item) => sum + item.sectionAPercentage, 0) / (analyticsData.length || 1);
    const sectionBAverage = analyticsData.reduce((sum, item) => sum + item.sectionBPercentage, 0) / (analyticsData.length || 1);
    const overallAverage = analyticsData.reduce((sum, item) => sum + item.overallPercentage, 0) / (analyticsData.length || 1);
    
    res.json({
      courses: analyticsData,
      averages: {
        sectionA: Math.round(sectionAAverage * 10) / 10,
        sectionB: Math.round(sectionBAverage * 10) / 10,
        overall: Math.round(overallAverage * 10) / 10,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAnalytics,
};
