import React, { useState, useEffect } from 'react';
import { Dataset } from './types/dataset';
import { fetchDatasets, rankDatasets } from './services/dataGovService';
import DatasetList from './components/DatasetList';
import { Search, Database, Brain } from 'lucide-react';

function App() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDatasets();
  }, []);

  async function loadDatasets() {
    try {
      const data = await fetchDatasets(1, 20);
      const rankedData = rankDatasets(data).slice(0, 10); // Focus on top 10 most relevant datasets
      
      // Analyze datasets sequentially to avoid rate limits
      const analyzedData = [];
      for (const dataset of rankedData) {
        const analyzed = await analyzeDatasetPotential(dataset);
        analyzedData.push(analyzed);
        setDatasets(prevDatasets => {
          const newDatasets = [...prevDatasets];
          const existingIndex = newDatasets.findIndex(d => d.title === analyzed.title);
          if (existingIndex >= 0) {
            newDatasets[existingIndex] = analyzed;
          } else {
            newDatasets.push(analyzed);
          }
          return newDatasets;
        });
      }
    } catch (err) {
      setError('Failed to load datasets. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Data.gov Explorer</h1>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">AI-Powered Analysis</span>
            </div>
          </div>
          
          <div className="mt-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search datasets..."
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg">
            {error}
          </div>
        ) : (
          <DatasetList datasets={datasets} />
        )}
      </main>
    </div>
  );
}

export default App;
