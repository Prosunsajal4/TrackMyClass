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
    
    const sectionAAverage = analyticsData.reduce((sum, item) => sum + item.sectionAPercentage, 0) / (analyticsData.length || 1);
    const sectionBAverage = analyticsData.reduce((sum, item) => sum + item.sectionBPercentage, 0) / (analyticsData.length || 1);
    const overallAverage = analyticsData.reduce((sum, item) => sum + item.overallPercentage, 0) / (analyticsData.length || 1);
    
    return NextResponse.json({
      courses: analyticsData,
      averages: {
        sectionA: Math.round(sectionAAverage * 10) / 10,
        sectionB: Math.round(sectionBAverage * 10) / 10,
        overall: Math.round(overallAverage * 10) / 10,
      },
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
