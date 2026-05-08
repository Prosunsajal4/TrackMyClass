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

export async function GET(request, { params }) {
  try {
    await connectDB();
    const decoded = verifyToken(request);
    
    if (!decoded) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const course = await Course.findById(params.id);
    
    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }
    
    if (course.user.toString() !== decoded.id) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }
    
    const stats = course.calculateStats();
    
    return NextResponse.json({ ...course.toObject(), stats });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const decoded = verifyToken(request);
    
    if (!decoded) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const course = await Course.findById(params.id);
    
    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }
    
    if (course.user.toString() !== decoded.id) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { courseName, totalClasses } = body;
    
    if (courseName) course.courseName = courseName;
    
    await course.save();
    
    return NextResponse.json(course.toObject());
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const decoded = verifyToken(request);
    
    if (!decoded) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const course = await Course.findById(params.id);
    
    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }
    
    if (course.user.toString() !== decoded.id) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }
    
    await course.deleteOne();
    
    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
