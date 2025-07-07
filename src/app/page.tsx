'use client';

import { useState } from 'react';

export default function Home() {
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleAnalyzePDF = async () => {
    setLoading(true);
    setResponse('Processing PDF...');
    
    try {
      const res = await fetch('/api/mistral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Bicycle OCR Analysis
      </h1>
      
      <div className="space-y-6">
        <div className="text-center">
          <button
            onClick={handleAnalyzePDF}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Analyzing PDF...' : 'Analyze Dealer Quotation'}
          </button>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-red-700">
            API Response:
          </label>
          <textarea
            value={response}
            readOnly
            className="w-full h-96 p-4 border border-red-300 rounded-lg bg-white font-mono text-sm text-black"
            placeholder="Click the button above to analyze the PDF and see the extracted bicycle data here..."
          />
        </div>
      </div>
    </div>
  );
}
