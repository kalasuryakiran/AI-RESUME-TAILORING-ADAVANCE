'use server';

import { analyzeGaps } from '@/ai/flows/gap-analysis';
import { optimizeContent } from '@/ai/flows/content-optimization';
import { calculateScore } from '@/ai/flows/score-calculator';
import type { AnalyzeResumeAndJobDescriptionOutput, OptimizeContentOutput, AtsScoreOutput } from '@/ai/schemas';

export async function performGapAnalysis(
  resumeText: string,
  jobDescriptionText: string,
  isFresher: boolean
): Promise<AnalyzeResumeAndJobDescriptionOutput> {
  if (!resumeText || !jobDescriptionText) {
    throw new Error('Resume and Job Description cannot be empty.');
  }
  try {
    const gapAnalysis = await analyzeGaps({ resumeText, jobDescriptionText, isFresher });
    return gapAnalysis;
  } catch(e) {
    console.error(e);
    throw new Error("Failed to analyze resume. The AI model might be unavailable.");
  }
}

export async function performContentOptimization(
  resumeContent: string,
  jobDescription: string,
  identifiedGaps: string,
  isFresher: boolean,
): Promise<OptimizeContentOutput> {
  if (!resumeContent || !jobDescription) {
    throw new Error('Missing required data for optimization.');
  }
   try {
    const result = await optimizeContent({ resumeContent, jobDescription, identifiedGaps, isFresher });
    return result;
  } catch(e) {
    console.error(e);
    throw new Error("Failed to optimize resume. The AI model might be unavailable.");
  }
}

export async function calculateAtsScore(
  resumeText: string,
  jobDescriptionText: string,
): Promise<AtsScoreOutput> {
  if (!resumeText || !jobDescriptionText) {
    throw new Error('Resume and Job Description cannot be empty for scoring.');
  }
  try {
    const result = await calculateScore({ resumeText, jobDescriptionText });
    return result;
  } catch(e) {
    console.error(e);
    throw new Error("Failed to calculate score. The AI model might be unavailable.");
  }
}
