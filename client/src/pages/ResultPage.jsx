import React, { useEffect, useState } from "react";
import axios from "axios";
import ResultTable from "../components/ResultTable";
import { API_URL } from "../config";

const ResultPage = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    axios.get(API_URL)
      .then(res => setResults(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-black min-h-screen text-white">
      <ResultTable data={results} />
    </div>
  );
};

export default ResultPage;
