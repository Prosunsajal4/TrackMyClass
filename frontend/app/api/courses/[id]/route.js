import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "../../db";
import Course from "../../models/Course";

const verifyToken = (request) => {
  const token = request.headers.get("authorization")?.split(" ")[1];
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
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const course = await Course.findById(params.id);

    if (!course) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 },
      );
    }

    if (course.user.toString() !== decoded.id) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
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
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const course = await Course.findById(params.id);

    if (!course) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 },
      );
    }

    if (course.user.toString() !== decoded.id) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const body = await request.json();
    const { courseName, sectionATotal, sectionBTotal } = body;

    if (courseName) course.courseName = courseName;

    // Update sectionA total and attendance array
    if (typeof sectionATotal === "number" && sectionATotal >= 1) {
      const oldTotal = course.sectionA.total;
      course.sectionA.total = sectionATotal;

      if (sectionATotal > oldTotal) {
        // Add new class slots
        for (let i = oldTotal + 1; i <= sectionATotal; i++) {
          course.sectionA.attendance.push({ classNumber: i, attended: false });
        }
      } else if (sectionATotal < oldTotal) {
        // Remove excess class slots
        course.sectionA.attendance = course.sectionA.attendance.filter(
          (item) => item.classNumber <= sectionATotal,
        );
      }
      // Recount attended from the actual array
      course.sectionA.attended = course.sectionA.attendance.filter(
        (item) => item.attended === true,
      ).length;
    }

    // Update sectionB total and attendance array
    if (typeof sectionBTotal === "number" && sectionBTotal >= 1) {
      const oldTotal = course.sectionB.total;
      course.sectionB.total = sectionBTotal;

      if (sectionBTotal > oldTotal) {
        for (let i = oldTotal + 1; i <= sectionBTotal; i++) {
          course.sectionB.attendance.push({ classNumber: i, attended: false });
        }
      } else if (sectionBTotal < oldTotal) {
        course.sectionB.attendance = course.sectionB.attendance.filter(
          (item) => item.classNumber <= sectionBTotal,
        );
      }
      // Recount attended from the actual array
      course.sectionB.attended = course.sectionB.attendance.filter(
        (item) => item.attended === true,
      ).length;
    }

    await course.save();

    const stats = course.calculateStats();

    return NextResponse.json({ ...course.toObject(), stats });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const decoded = verifyToken(request);

    if (!decoded) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const course = await Course.findById(params.id);

    if (!course) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 },
      );
    }

    if (course.user.toString() !== decoded.id) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    await course.deleteOne();

    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
