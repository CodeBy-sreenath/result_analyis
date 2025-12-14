// utils/resultProcessor.js

export const processExtractedData = (extractedData) => {
  const results = [];

  if (!extractedData || !Array.isArray(extractedData.departments)) {
    console.error("❌ Invalid extracted data format.");
    return [];
  }

  extractedData.departments.forEach((dept) => {
    const departmentName = dept.name || "UNKNOWN";

    // Ensure "students" array exists
    const students = Array.isArray(dept.students) ? dept.students : [];

    students.forEach((student) => {
      const registerNo = student.registerNumber || student.registerNo || "";
      if (!registerNo) return; // skip invalid roll numbers

      const subjects = Array.isArray(student.subjects) ? student.subjects : [];

      const processedSubjects = subjects.map((subj) => ({
        code: subj.code || "",
        grade: subj.grade || "",
      }));

      // Determine PASS/FAIL
      const failed = processedSubjects.some(
        (s) =>
          ["F", "FE", "Failed", "FAIL"].includes(s.grade?.toUpperCase()) ||
          s.grade?.toLowerCase() === "absent"
      );

      results.push({
        registerNo,
        department: departmentName,
        subjects: processedSubjects,
        status: failed ? "Fail" : "Pass",
      });
    });
  });

  return results;
};
