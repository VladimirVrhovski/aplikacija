/**
 * Calculates the weighted GPA of exams.
 * Weighted average = sum(grade * ects) / sum(ects)
 * Returns a number rounded to 2 decimal places, or null if exams is empty.
 * @param {Array} exams
 * @returns {number|null}
 */
function calcGPA(exams) {
  if (!exams || exams.length === 0) {
    return null;
  }
  
  let totalGradeWeighted = 0;
  let totalECTS = 0;
  
  for (const exam of exams) {
    const grade = parseFloat(exam.grade);
    const ects = parseInt(exam.ects, 10);
    
    if (!isNaN(grade) && !isNaN(ects) && ects > 0) {
      totalGradeWeighted += grade * ects;
      totalECTS += ects;
    }
  }
  
  if (totalECTS === 0) {
    return null;
  }
  
  const gpa = totalGradeWeighted / totalECTS;
  return Math.round(gpa * 100) / 100;
}

/**
 * Calculates the total ECTS credits of exams.
 * Returns an integer.
 * @param {Array} exams
 * @returns {number}
 */
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
