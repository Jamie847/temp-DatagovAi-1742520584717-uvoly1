import React from 'react';
import { Dataset } from '../types/dataset';
import { FileJson2, Database, Star, ChevronDown, ChevronUp } from 'lucide-react';
import DatasetAnalysis from './DatasetAnalysis';

interface Props {
  datasets: Dataset[];
  onSelectDataset: (dataset: Dataset) => void;
}

export default function DatasetList({ datasets }: Props) {
  const [expandedDataset, setExpandedDataset] = React.useState<string | null>(null);

  const toggleDataset = (datasetTitle: string) => {
    setExpandedDataset(expandedDataset === datasetTitle ? null : datasetTitle);
  };

  return (
    <div className="space-y-4">
      {datasets.map((dataset, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div
            className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => toggleDataset(dataset.title)}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <FileJson2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">{dataset.title}</h3>
                {expandedDataset === dataset.title ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <p className="mt-2 text-gray-600 line-clamp-2">{dataset.description}</p>
              
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Database className="w-4 h-4" />
                  <span>{dataset.format}</span>
                </div>
                {dataset.aiRelevanceScore !== undefined && (
                  <div className="flex items-center gap-1 text-sm text-yellow-600">
                    <Star className="w-4 h-4 fill-current" />
                    <span>Score: {dataset.aiRelevanceScore}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          {expandedDataset === dataset.title && (
            <div className="border-t border-gray-100">
              <DatasetAnalysis dataset={dataset} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}