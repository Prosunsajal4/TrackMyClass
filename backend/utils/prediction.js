// AI-like prediction utilities for attendance

// Predict future attendance based on current trend
const predictFutureAttendance = (currentPercentage, totalClasses, attendedClasses, futureClasses = 5) => {
  const attendanceRate = currentPercentage / 100;
  const predictedAttended = Math.round(futureClasses * attendanceRate);
  const predictedMissed = futureClasses - predictedAttended;
  
  const newTotalClasses = totalClasses + futureClasses;
  const newAttendedClasses = attendedClasses + predictedAttended;
  const predictedPercentage = (newAttendedClasses / newTotalClasses) * 100;
  
  return {
    predictedPercentage: Math.round(predictedPercentage * 10) / 10,
    predictedAttended,
    predictedMissed,
    trend: attendanceRate >= 0.75 ? 'stable' : attendanceRate >= 0.6 ? 'declining' : 'critical',
  };
};

// Generate intelligent suggestions
const generateSuggestions = (stats) => {
  const suggestions = [];
  const { sectionAPercentage, sectionBPercentage, overallPercentage, safeAbsences, riskLevel } = stats;
  
  // Risk warnings
  if (riskLevel === 'high') {
    suggestions.push({
      type: 'danger',
      message: '⚠️ Your attendance is critically low! Attend all upcoming classes.',
      priority: 1,
    });
  } else if (riskLevel === 'medium') {
    suggestions.push({
      type: 'warning',
      message: '⚡ Your attendance is below 75%. Focus on attending next few classes.',
      priority: 2,
    });
  }
  
  // Section-specific warnings
  if (sectionAPercentage < 70) {
    suggestions.push({
      type: 'warning',
      message: `📚 Section A attendance (${sectionAPercentage}%) needs improvement.`,
      priority: 3,
    });
  }
  
  if (sectionBPercentage < 70) {
    suggestions.push({
      type: 'warning',
      message: `📚 Section B attendance (${sectionBPercentage}%) needs improvement.`,
      priority: 3,
    });
  }
  
  // Safe absences info
  if (safeAbsences > 2) {
    suggestions.push({
      type: 'success',
      message: `✅ You can safely miss ${safeAbsences} more classes while staying above 75%.`,
      priority: 4,
    });
  } else if (safeAbsences > 0) {
    suggestions.push({
      type: 'info',
      message: `ℹ️ You can safely miss ${safeAbsences} more class.`,
      priority: 4,
    });
  } else if (safeAbsences <= 0) {
    suggestions.push({
      type: 'danger',
      message: '🚫 You cannot miss any more classes if you want to stay above 75%.',
      priority: 1,
    });
  }
  
  // Calculate classes needed to reach 75%
  if (overallPercentage < 75) {
    const classesTo75 = calculateClassesToReachTarget(stats, 75);
    if (classesTo75 > 0) {
      suggestions.push({
        type: 'info',
        message: `📈 Attend next ${classesTo75} classes to reach 75% attendance.`,
        priority: 2,
      });
    }
  }
  
  // Calculate classes needed to reach 80%
  if (overallPercentage < 80) {
    const classesTo80 = calculateClassesToReachTarget(stats, 80);
    if (classesTo80 > 0 && classesTo80 <= 10) {
      suggestions.push({
        type: 'info',
        message: `🎯 Attend next ${classesTo80} classes to reach 80% attendance.`,
        priority: 5,
      });
    }
  }
  
  return suggestions.sort((a, b) => a.priority - b.priority);
};

// Calculate how many consecutive classes needed to reach target percentage
const calculateClassesToReachTarget = (stats, targetPercentage) => {
  const { totalAttended, totalClasses } = stats;
  
  let classesNeeded = 0;
  let projectedAttended = totalAttended;
  let projectedTotal = totalClasses;
  
  while ((projectedAttended / projectedTotal) * 100 < targetPercentage && classesNeeded < 50) {
    projectedAttended++;
    projectedTotal++;
    classesNeeded++;
  }
  
  return classesNeeded;
};

// Predict marks based on attendance
const predictMarks = (sectionAPercentage, sectionBPercentage) => {
  const sectionAMarks = (sectionAPercentage / 100) * 5;
  const sectionBMarks = (sectionBPercentage / 100) * 5;
  const totalMarks = sectionAMarks + sectionBMarks;
  
  return {
    sectionAMarks: Math.round(sectionAMarks * 10) / 10,
    sectionBMarks: Math.round(sectionBMarks * 10) / 10,
    totalMarks: Math.round(totalMarks * 10) / 10,
    grade: calculateGrade(totalMarks),
  };
};

const calculateGrade = (marks) => {
  if (marks >= 9) return 'A+';
  if (marks >= 8) return 'A';
  if (marks >= 7) return 'B+';
  if (marks >= 6) return 'B';
  if (marks >= 5) return 'C';
  return 'D';
};

module.exports = {
  predictFutureAttendance,
  generateSuggestions,
  calculateClassesToReachTarget,
  predictMarks,
  calculateGrade,
};
