import React, { useEffect, useState } from "react";
import axios from "axios";
import ResultTable from "../components/ResultTable";

const API_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const PreviousResultsPage = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchStoredResults();
  }, []);

  const fetchStoredResults = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/results`);
      setResults(res.data);
    } catch (err) {
      console.error("Error fetching saved results:", err);
    }
  };

  return (
    <div className="pt-20">
      <h1 className="text-center text-3xl font-bold text-cyan-400 mb-6">
        Previous Results
      </h1>

      <ResultTable data={results} />
    </div>
  );
};

export default PreviousResultsPage;
