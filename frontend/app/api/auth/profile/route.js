import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../db';
import User from '../../models/User';

export async function GET(request) {
  try {
    await connectDB();
    
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ message: 'Not authorized, no token' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 });
  }
}
