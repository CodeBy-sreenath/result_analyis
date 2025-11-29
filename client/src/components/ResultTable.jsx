import React from "react";

const ResultTable = () => {
  return (
    <div className="fixed top-20 left-0 right-0 bottom-0 overflow-y-auto bg-gradient-to-b from-gray-900 to-black">
      {/* STATS SECTION */}
      <div className="mb-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="bg-black/50 backdrop-blur-md border-b md:border-r border-gray-700 p-6">
            <h3 className="text-cyan-400 text-sm font-semibold mb-2">Total Failed Students</h3>
            <p className="text-white text-3xl font-bold">0</p>
          </div>
          <div className="bg-black/50 backdrop-blur-md border-b border-gray-700 p-6">
            <h3 className="text-green-400 text-sm font-semibold mb-2">Pass Percentage</h3>
            <p className="text-white text-3xl font-bold">0%</p>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="w-full pb-6">
        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full divide-y divide-gray-700 border-t border-gray-700 shadow-lg bg-black/50 backdrop-blur-md">
            <thead className="bg-gray-800/80">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-cyan-400">
                  Register Number
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-cyan-400">
                  Failed Subjects
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-cyan-400">
                  Passed Subjects
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-cyan-400">
                  Pass / Fail
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-cyan-400">
                  SGPA
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700 bg-gray-900/50">
              {/* dynamic rows later */}
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                  No results to display. Upload a file to see data.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* MOBILE CARD VIEW */}
        <div className="md:hidden px-4 space-y-4">
          {/* Sample Card - Replace with dynamic data later */}
          <div className="bg-black/50 backdrop-blur-md border border-gray-700 rounded-lg p-5 shadow-lg">
            <div className="space-y-4">
              <div className="border-b border-gray-700 pb-3">
                <div className="text-xs text-cyan-400 font-semibold mb-1">Register Number</div>
                <div className="text-white font-medium">-</div>
              </div>
              
              <div className="border-b border-gray-700 pb-3">
                <div className="text-xs text-cyan-400 font-semibold mb-1">Failed Subjects</div>
                <div className="text-white">-</div>
              </div>
              
              <div className="border-b border-gray-700 pb-3">
                <div className="text-xs text-cyan-400 font-semibold mb-1">Passed Subjects</div>
                <div className="text-white">-</div>
              </div>
              
              <div className="border-b border-gray-700 pb-3">
                <div className="text-xs text-cyan-400 font-semibold mb-1">Status</div>
                <div className="text-white">
                  <span className="px-3 py-1 rounded-full text-sm bg-gray-700">-</span>
                </div>
              </div>
              
              <div>
                <div className="text-xs text-cyan-400 font-semibold mb-1">SGPA</div>
                <div className="text-white text-lg font-bold">-</div>
              </div>
            </div>
          </div>

          {/* Empty State Message */}
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">No results to display. Upload a file to see data.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultTable;