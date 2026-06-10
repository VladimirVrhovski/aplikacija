function calcGPA(exams) {
  if (!exams || exams.length === 0) {
    return null;
  }
  
  let totalGrade = 0;
  let count = 0;
  
  for (const exam of exams) {
    const grade = parseFloat(exam.grade);
    
    if (!isNaN(grade)) {
      totalGrade += grade;
      count++;
    }
  }
  
  if (count === 0) {
    return null;
  }
  
  const gpa = totalGrade / count;
  return Math.round(gpa * 100) / 100;
}

function calcTotalECTS(exams) {
  if (!exams || exams.length === 0) {
    return 0;
  }
  
  let totalECTS = 0;
  for (const exam of exams) {
    const ects = parseInt(exam.ects, 10);
    if (!isNaN(ects)) {
      totalECTS += ects;
    }
  }
  
  return totalECTS;
}

module.exports = {
  calcGPA,
  calcTotalECTS
};
