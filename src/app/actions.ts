'use server';

import { analyzeResumeAndJobDescription, AnalyzeResumeAndJobDescriptionOutput } from '@/ai/flows/gap-analysis';
import { optimizeContent, OptimizeContentOutput } from '@/ai/flows/content-optimization';

export async function performGapAnalysis(
  resumeText: string,
  jobDescriptionText: string
): Promise<AnalyzeResumeAndJobDescriptionOutput> {
  if (!resumeText || !jobDescriptionText) {
    throw new Error('Resume and Job Description cannot be empty.');
  }
  try {
    const result = await analyzeResumeAndJobDescription({ resumeText, jobDescriptionText });
    return result;
  } catch(e) {
    console.error(e);
    throw new Error("Failed to analyze resume. The AI model might be unavailable.");
  }
}

export async function performContentOptimization(
  resumeContent: string,
  jobDescription: string,
  identifiedGaps: string
): Promise<OptimizeContentOutput> {
  if (!resumeContent || !jobDescription) {
    throw new Error('Missing required data for optimization.');
  }
   try {
    const result = await optimizeContent({ resumeContent, jobDescription, identifiedGaps });
    return result;
  } catch(e) {
    console.error(e);
    throw new Error("Failed to optimize resume. The AI model might be unavailable.");
  }
}
