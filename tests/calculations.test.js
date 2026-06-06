const { calcGPA, calcTotalECTS } = require('../src/utils/calculations');

describe('calcTotalECTS', () => {
  test('returns 0 for empty array input', () => {
    expect(calcTotalECTS([])).toBe(0);
    expect(calcTotalECTS(null)).toBe(0);
    expect(calcTotalECTS(undefined)).toBe(0);
  });

  test('returns ects of a single exam', () => {
    const exams = [{ grade: 8, ects: 6 }];
    expect(calcTotalECTS(exams)).toBe(6);
  });

  test('returns sum of ECTS for multiple exams', () => {
    const exams = [
      { grade: 8, ects: 6 },
      { grade: 9, ects: 4 },
      { grade: 10, ects: 10 }
    ];
    expect(calcTotalECTS(exams)).toBe(20);
  });
});

describe('calcGPA', () => {
  test('returns null for empty array input', () => {
    expect(calcGPA([])).toBeNull();
    expect(calcGPA(null)).toBeNull();
    expect(calcGPA(undefined)).toBeNull();
  });

  test('returns grade for a single exam', () => {
    const exams = [{ grade: 8, ects: 6 }];
    expect(calcGPA(exams)).toBe(8);
  });

  test('calculates correct weighted average for multiple exams', () => {
    // Math example:
    // (8 * 6) + (9 * 4) = 48 + 36 = 84
    // Total ECTS = 6 + 4 = 10
    // Weighted GPA = 84 / 10 = 8.40
    // Simple average would be (8 + 9) / 2 = 8.5, which is different
    const exams = [
      { grade: 8, ects: 6 },
      { grade: 9, ects: 4 }
    ];
    expect(calcGPA(exams)).toBe(8.40);
  });

  test('calculates GPA correctly with non-integer weights', () => {
    // (7 * 5) + (10 * 3) = 35 + 30 = 65
    // Total ECTS = 8
    // Weighted GPA = 65 / 8 = 8.125 -> rounded to 8.13
    const exams = [
      { grade: 7, ects: 5 },
      { grade: 10, ects: 3 }
    ];
    expect(calcGPA(exams)).toBe(8.13);
  });

  test('edge case: all exams have grade 10', () => {
    const exams = [
      { grade: 10, ects: 6 },
      { grade: 10, ects: 10 },
      { grade: 10, ects: 4 }
    ];
    expect(calcGPA(exams)).toBe(10);
  });
});
