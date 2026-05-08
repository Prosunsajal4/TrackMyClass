import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../db';
import Course from '../../models/Course';

const verifyToken = (request) => {
  const token = request.headers.get('authorization')?.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

export async function GET(request) {
  try {
    await connectDB();
    const decoded = verifyToken(request);
    
    if (!decoded) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const courses = await Course.find({ user: decoded.id });
    
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
    
    if (totalCourses > 0) {
      overallPercentage = overallPercentage / totalCourses;
      totalMarks = totalMarks / totalCourses;
    }
    
    const prediction = {
      predictedPercentage: overallPercentage,
      predictedAttended: Math.round(5 * (overallPercentage / 100)),
      predictedMissed: 5 - Math.round(5 * (overallPercentage / 100)),
      trend: overallPercentage >= 75 ? 'stable' : overallPercentage >= 60 ? 'declining' : 'critical',
    };
    
    return NextResponse.json({
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
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
