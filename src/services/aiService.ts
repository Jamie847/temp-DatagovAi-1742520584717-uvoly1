import Anthropic from '@anthropic-ai/sdk';
import { Dataset } from '../types/dataset';

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_CLAUDE_API_KEY
});

const SYSTEM_PROMPT = `You are an expert startup advisor and data scientist specializing in:
- Identifying valuable commercial applications of public datasets
- Understanding market opportunities and user needs
- Designing data-driven solutions that solve real problems

Analyze the dataset carefully and be specific about how the data could be transformed into valuable applications.`;

export async function analyzeDatasetWithAI(dataset: Dataset) {
  const prompt = `${SYSTEM_PROMPT}

Dataset Information:
Title: ${dataset.title}
Description: ${dataset.description}
Format: ${dataset.format}

Analyze this dataset and provide:
1. App Concept: A specific, practical application that leverages this data
2. Market Analysis: 
   - Primary user segments
   - Key pain points solved
   - Market size and opportunity
3. Technical Implementation:
   - Core features and functionality
   - Data processing requirements
   - Integration possibilities
4. Business Model:
   - Monetization strategy
   - Potential revenue streams
   - Go-to-market approach
5. Feasibility Assessment (1-10):
   - Commercial viability (market size, revenue potential)
   - Technical feasibility (implementation complexity)
   - Market uniqueness (competitive advantage)

Respond in JSON format.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1500,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }]
    });

    const analysis = JSON.parse(response.content[0].text);
    
    return {
      appIdea: {
        name: analysis.appName,
        summary: analysis.summary,
        targetUser: analysis.targetUsers,
        problemSolved: analysis.problem,
        features: analysis.features,
        monetization: analysis.monetizationStrategy
      },
      feasibilityScores: {
        commercial: analysis.scores.commercialViability,
        technical: analysis.scores.technicalFeasibility,
        uniqueness: analysis.scores.marketUniqueness
      }
    };
  } catch (error) {
    console.error('AI Analysis failed:', error);
    throw new Error('Failed to analyze dataset with AI');
  }
}