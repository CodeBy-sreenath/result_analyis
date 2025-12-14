import React, { useMemo } from "react";

/**
 * Robust ResultTable (fixed pass% and totals)
 * - Student-level pass/fail is used for totals and pass percentage.
 * - Per-row still shows failed/passed subject counts and SGPA.
 *
 * Expects subjects as: { code, subjectName?, grade, credits? }
 */

const gradePoints = {
  S: 10,
  "A+": 9,
  A: 8.5,
  "B+": 8,
  B: 7.5,
  "C+": 7,
  C: 6.5,
  D: 6,
  P: 5.5,
  F: 0,
  ABSENT: 0,
  FE: 0,
  WITHHELD: 0,
  TBP: null,
};

const normalizeGrade = (g) => {
  if (g === null || g === undefined) return "";
  return String(g).trim();
};

const calcCountsFromSubjects = (subjects = []) => {
  let passed = 0;
  let failed = 0;

  subjects.forEach((s) => {
    const g = normalizeGrade(s?.grade);
    if (!g) return;

    const up = g.toUpperCase();
    if (["F", "FE", "ABSENT"].includes(up)) {
      failed += 1;
    } else if (["TBP", "WITHHELD"].includes(up)) {
      // treat as neither
    } else {
      passed += 1;
    }
  });

  return { passed, failed };
};

const computeSGPAFromSubjects = (subjects = []) => {
  let totalPoints = 0;
  let totalCredits = 0;

  subjects.forEach((s) => {
    const gRaw = normalizeGrade(s?.grade);
    if (!gRaw) return;

    const g = gRaw.toUpperCase();
    const credits = typeof s?.credits === "number" && s.credits > 0 ? s.credits : 3;

    // gradePoints map contains uppercase keys (and some mixed-case). Try both.
    const gp = gradePoints[g] ?? gradePoints[gRaw] ?? null;

    if (gp === null || gp === undefined) return; // skip TBP etc.

    totalPoints += gp * credits;
    totalCredits += credits;
  });

  if (totalCredits === 0) return 0;
  return Number((totalPoints / totalCredits).toFixed(2));
};

// helper to get subject name (prefer subjectName then code)
const subjDisplay = (s) => s?.subjectName || s?.name || s?.code || "Unknown";

const getSubjectLists = (subjects = []) => {
  const failed = [];
  const passed = [];

  subjects.forEach((sub) => {
    if (!sub) return;
    const g = normalizeGrade(sub.grade);
    if (!g) return;
    const up = g.toUpperCase();

    if (["F", "FE", "ABSENT"].includes(up)) {
      failed.push(subjDisplay(sub));
    } else if (!["TBP", "WITHHELD"].includes(up)) {
      passed.push(subjDisplay(sub));
    }
  });

  return { failed, passed };
};

const ResultTable = ({ data = [] }) => {
  // Student-level totals and pass percentage (FIXED)
  const { totalStudents, totalFailedStudents, passPercentage } = useMemo(() => {
    const totalStudents = data.length;
    let failedStudentsCount = 0;
    let passedStudentsCount = 0;

    data.forEach((student) => {
      // Determine per-student failed subject count
      const failedFromField =
        typeof student.totalFailed === "number"
          ? student.totalFailed
          : Array.isArray(student.failedSubjects)
          ? student.failedSubjects.length
          : undefined;

      let failedCount;
      if (typeof failedFromField === "number") {
        failedCount = failedFromField;
      } else if (Array.isArray(student.subjects)) {
        failedCount = calcCountsFromSubjects(student.subjects).failed;
      } else {
        // fallback: if explicit status exist, use it
        failedCount = student.status === "Fail" ? 1 : 0;
      }

      // A student is considered failed if failedCount > 0 OR explicit status 'Fail'
      if (failedCount > 0 || student.status === "Fail") {
        failedStudentsCount += 1;
      } else {
        passedStudentsCount += 1;
      }
    });

    // Safety: if totalStudents === 0 avoid division by zero
    const passPercentage =
      totalStudents > 0 ? ((passedStudentsCount / totalStudents) * 100).toFixed(2) : "0.00";

    return {
      totalStudents,
      totalFailedStudents: failedStudentsCount,
      passPercentage,
    };
  }, [data]);

  return (
    <div className="fixed top-20 left-0 right-0 bottom-0 overflow-y-auto bg-gradient-to-b from-gray-900 to-black">
      {/* STATS */}
      <div className="mb-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="bg-black/50 backdrop-blur-md border-b md:border-r border-gray-700 p-6">
            <h3 className="text-cyan-400 text-sm font-semibold mb-2">Total Failed Students</h3>
            <p className="text-white text-3xl font-bold">{totalFailedStudents}</p>
          </div>
          <div className="bg-black/50 backdrop-blur-md border-b border-gray-700 p-6">
            <h3 className="text-green-400 text-sm font-semibold mb-2">Pass Percentage</h3>
            <p className="text-white text-3xl font-bold">{passPercentage}%</p>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="w-full pb-6">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full divide-y divide-gray-700 border-t border-gray-700 shadow-lg bg-black/50 backdrop-blur-md">
            <thead className="bg-gray-800/80">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-cyan-400">Register Number</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-cyan-400">Failed Subjects</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-cyan-400">Passed Subjects</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-cyan-400">Pass / Fail</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-cyan-400">SGPA</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700 bg-gray-900/50">
              {data.length > 0 ? (
                data.map((student, idx) => {
                  const reg = student.registerNo || student.registerNumber || student.register || "";
                  const { failed, passed } = Array.isArray(student.subjects)
                    ? getSubjectLists(student.subjects)
                    : {
                        failed: Array.isArray(student.failedSubjects) ? student.failedSubjects.map(subjDisplay) : [],
                        passed: Array.isArray(student.passedSubjects) ? student.passedSubjects.map(subjDisplay) : [],
                      };

                  const failedCount = failed.length;
                  const passedCount = passed.length;

                  const status = student.status || (failedCount > 0 ? "Fail" : "Pass");

                  // sgpa: prefer numeric sgpa, else compute from subjects
                  const sgpaProvided = typeof student.sgpa === "number" ? student.sgpa : Number(student.sgpa) || null;
                  const sgpaComputed = Array.isArray(student.subjects) ? computeSGPAFromSubjects(student.subjects) : null;
                  const sgpaToShow = sgpaProvided ?? sgpaComputed ?? 0.0;

                  return (
                    <tr key={idx} className="hover:bg-gray-800/50 transition">
                      <td className="px-6 py-4 text-white">{reg}</td>

                      <td className="px-6 py-4 text-red-300">
                        {failedCount > 0 ? failed.join(", ") : "None"}
                      </td>

                      <td className="px-6 py-4 text-green-300">{passedCount > 0 ? passed.join(", ") : "None"}</td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            status === "Pass" ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-white font-semibold">
                        {typeof sgpaToShow === "number" ? sgpaToShow.toFixed(2) : Number(sgpaToShow).toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                    No results to display. Upload a file to see data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW */}
        <div className="md:hidden px-4 space-y-4">
          {data.length > 0 ? (
            data.map((student, idx) => {
              const reg = student.registerNo || student.registerNumber || student.register || "";
              const { failed, passed } = Array.isArray(student.subjects)
                ? getSubjectLists(student.subjects)
                : {
                    failed: Array.isArray(student.failedSubjects) ? student.failedSubjects.map(subjDisplay) : [],
                    passed: Array.isArray(student.passedSubjects) ? student.passedSubjects.map(subjDisplay) : [],
                  };

              const failedCount = failed.length;
              const passedCount = passed.length;
              const status = student.status || (failedCount > 0 ? "Fail" : "Pass");
              const sgpaProvided = typeof student.sgpa === "number" ? student.sgpa : Number(student.sgpa) || null;
              const sgpaComputed = Array.isArray(student.subjects) ? computeSGPAFromSubjects(student.subjects) : null;
              const sgpaToShow = sgpaProvided ?? sgpaComputed ?? 0.0;

              return (
                <div key={idx} className="bg-black/50 backdrop-blur-md border border-gray-700 rounded-lg p-5 shadow-lg">
                  <div className="space-y-4">
                    <div className="border-b border-gray-700 pb-3">
                      <div className="text-xs text-cyan-400 font-semibold mb-1">Register Number</div>
                      <div className="text-white font-medium">{reg}</div>
                    </div>

                    <div className="border-b border-gray-700 pb-3">
                      <div className="text-xs text-red-400 font-semibold mb-1">Failed Subjects</div>
                      <div className="text-white">{failedCount > 0 ? failed.join(", ") : "None"}</div>
                    </div>

                    <div className="border-b border-gray-700 pb-3">
                      <div className="text-xs text-green-400 font-semibold mb-1">Passed Subjects</div>
                      <div className="text-white">{passedCount > 0 ? passed.join(", ") : "None"}</div>
                    </div>

                    <div className="border-b border-gray-700 pb-3">
                      <div className="text-xs text-cyan-400 font-semibold mb-1">Status</div>
                      <div className="text-white">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${status === "Pass" ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"}`}>{status}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-cyan-400 font-semibold mb-1">SGPA</div>
                      <div className="text-white text-lg font-bold">{typeof sgpaToShow === "number" ? sgpaToShow.toFixed(2) : Number(sgpaToShow).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-black/50 backdrop-blur-md border border-gray-700 rounded-lg p-5 shadow-lg">
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">No results to display. Upload a file to see data.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultTable;
