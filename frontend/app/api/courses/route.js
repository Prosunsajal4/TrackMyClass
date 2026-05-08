import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "../db";
import Course from "../models/Course";

const verifyToken = (request) => {
  const token = request.headers.get("authorization")?.split(" ")[1];
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
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const courses = await Course.find({ user: decoded.id }).sort({
      createdAt: -1,
    });

    const coursesWithStats = courses.map((course) => {
      const stats = course.calculateStats();
      return {
        ...course.toObject(),
        stats,
      };
    });

    return NextResponse.json(coursesWithStats);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const decoded = verifyToken(request);

    if (!decoded) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const body = await request.json();
    const { courseName, sectionATotal = 30, sectionBTotal = 30 } = body;

    if (!courseName) {
      return NextResponse.json(
        { message: "Please provide a course name" },
        { status: 400 },
      );
    }

    const sectionAAttendance = [];
    const sectionBAttendance = [];

    for (let i = 1; i <= sectionATotal; i++) {
      sectionAAttendance.push({ classNumber: i, attended: false });
    }

    for (let i = 1; i <= sectionBTotal; i++) {
      sectionBAttendance.push({ classNumber: i, attended: false });
    }

    const course = await Course.create({
      user: decoded.id,
      courseName,
      sectionA: {
        total: sectionATotal,
        attended: 0,
        attendance: sectionAAttendance,
      },
      sectionB: {
        total: sectionBTotal,
        attended: 0,
        attendance: sectionBAttendance,
      },
    });

    const stats = course.calculateStats();

    return NextResponse.json({ ...course.toObject(), stats }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
