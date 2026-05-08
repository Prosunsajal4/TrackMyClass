import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../../db';
import Course from '../../../models/Course';

const verifyToken = (request) => {
  const token = request.headers.get('authorization')?.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

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
    const { section, classNumber, attended } = body;
    
    if (!section || !['A', 'B'].includes(section)) {
      return NextResponse.json({ message: 'Invalid section' }, { status: 400 });
    }
    
    if (typeof classNumber !== 'number' || classNumber < 1) {
      return NextResponse.json({ message: 'Invalid class number' }, { status: 400 });
    }
    
    const sectionKey = section === 'A' ? 'sectionA' : 'sectionB';
    const attendanceArray = course[sectionKey].attendance;
    
    const classIndex = attendanceArray.findIndex(
      (item) => item.classNumber === classNumber
    );
    
    if (classIndex === -1) {
      return NextResponse.json({ message: 'Class not found' }, { status: 404 });
    }
    
    const wasAttended = attendanceArray[classIndex].attended;
    attendanceArray[classIndex].attended = attended;
    attendanceArray[classIndex].date = Date.now();
    
    if (attended && !wasAttended) {
      course[sectionKey].attended += 1;
    } else if (!attended && wasAttended) {
      course[sectionKey].attended -= 1;
    }
    
    await course.save();
    
    const stats = course.calculateStats();
    
    return NextResponse.json({ ...course.toObject(), stats });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
