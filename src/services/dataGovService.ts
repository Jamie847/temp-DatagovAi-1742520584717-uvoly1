import { Dataset } from '../types/dataset';
import { analyzeDatasetWithAI } from './aiService';

const DATA_GOV_URL = 'https://catalog.data.gov/api/3/action/package_search';

export async function fetchDatasets(page = 1, limit = 10): Promise<Dataset[]> {
  try {
    const response = await fetch(
      `${DATA_GOV_URL}?start=${(page - 1) * limit}&rows=${limit}`
    );
    const data = await response.json();
    
    return data.result.results.map((result: any) => ({
      title: result.title,
      description: result.notes || 'No description available',
      url: result.url || `https://catalog.data.gov/dataset/${result.name}`,
      format: result.resources?.[0]?.format || 'Unknown'
    }));
  } catch (error) {
    console.error('Error fetching datasets:', error);
    return [];
  }
}

export function rankDatasets(datasets: Dataset[]): Dataset[] {
  const keywords = ['structured', 'csv', 'json', 'api', 'machine learning', 'big data'];
  
  return datasets.map(dataset => ({
    ...dataset,
    aiRelevanceScore: calculateRelevanceScore(dataset, keywords)
  }))
  .sort((a, b) => (b.aiRelevanceScore || 0) - (a.aiRelevanceScore || 0));
}

function calculateRelevanceScore(dataset: Dataset, keywords: string[]): number {
  const description = dataset.description.toLowerCase();
  const format = dataset.format.toLowerCase();
  
  let score = keywords.reduce((acc, keyword) => 
    acc + (description.includes(keyword.toLowerCase()) ? 1 : 0), 
    0
  );
  
  if (['csv', 'json', 'api'].includes(format)) {
    score += 2;
  }
  
  return score;
}

export async function analyzeDatasetPotential(dataset: Dataset): Promise<Dataset> {
  try {
    const analysis = await analyzeDatasetWithAI(dataset);
    return {
      ...dataset,
      analysis
    };
  } catch (error) {
    console.error('Failed to analyze dataset:', error);
    return dataset;
  }
}