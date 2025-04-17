import React from 'react';
import { useParams } from 'react-router-dom';

const ResultsPage = () => {
  const { city } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold text-blue-600">
        Showing results for: {city}
      </h1>
    </div>
  );
};

export default ResultsPage;
