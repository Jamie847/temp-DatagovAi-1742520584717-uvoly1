export interface Dataset {
  title: string;
  description: string;
  url: string;
  format: string;
  aiRelevanceScore?: number;
  analysis?: {
    appIdea: {
      name: string;
      summary: string;
      targetUser: string;
      problemSolved: string;
      features: string[];
      monetization: string;
    };
    feasibilityScores: {
      commercial: number;
      technical: number;
      uniqueness: number;
    };
  };
}

export interface DatasetAnalysis {
  correlations: Array<{
    datasets: [string, string];
    strength: number;
    description: string;
  }>;
  commercialOpportunities: Array<{
    title: string;
    description: string;
    relevantDatasets: string[];
    potentialValue: string;
  }>;
}