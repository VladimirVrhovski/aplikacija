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

  test('calculates correct simple average for multiple exams', () => {
    // Math example:
    // (8 + 9) / 2 = 8.5
    const exams = [
      { grade: 8, ects: 6 },
      { grade: 9, ects: 4 }
    ];
    expect(calcGPA(exams)).toBe(8.5);
  });

  test('calculates simple average correctly with decimals', () => {
    // (8 + 9 + 9) / 3 = 26 / 3 = 8.666... -> rounded to 8.67
    const exams = [
      { grade: 8, ects: 5 },
      { grade: 9, ects: 3 },
      { grade: 9, ects: 6 }
    ];
    expect(calcGPA(exams)).toBe(8.67);
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
