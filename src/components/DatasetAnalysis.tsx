import React from 'react';
import { Dataset } from '../types/dataset';
import { Lightbulb, Target, DollarSign, BarChart3 } from 'lucide-react';

interface Props {
  dataset: Dataset;
}

export default function DatasetAnalysis({ dataset }: Props) {
  if (!dataset.analysis) return null;

  const { appIdea, feasibilityScores } = dataset.analysis;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-4">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-6 h-6 text-yellow-500" />
        <h3 className="text-xl font-semibold text-gray-900">AI-Generated App Idea</h3>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-700">{appIdea.name}</h4>
          <p className="text-gray-600">{appIdea.summary}</p>
        </div>

        <div className="flex items-start gap-2">
          <Target className="w-5 h-5 text-blue-500 mt-1" />
          <div>
            <h5 className="font-medium text-gray-700">Target Users</h5>
            <p className="text-gray-600">{appIdea.targetUser}</p>
          </div>
        </div>

        <div>
          <h5 className="font-medium text-gray-700 mb-2">Key Features</h5>
          <ul className="space-y-2">
            {appIdea.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-start gap-2">
          <DollarSign className="w-5 h-5 text-green-500 mt-1" />
          <div>
            <h5 className="font-medium text-gray-700">Monetization Strategy</h5>
            <p className="text-gray-600">{appIdea.monetization}</p>
          </div>
        </div>

        <div className="border-t pt-4 mt-6">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            <h5 className="font-medium text-gray-700">Feasibility Scores</h5>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(feasibilityScores).map(([key, score]) => (
              <div key={key} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{score}/10</div>
                <div className="text-sm text-gray-500 capitalize">{key}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}