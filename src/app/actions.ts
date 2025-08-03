'use server';

import { analyzeResumeAndJobDescription } from '@/ai/flows/gap-analysis';
import { optimizeContent } from '@/ai/flows/content-optimization';
import { analyzeResume } from '@/ai/flows/resume-analysis';
import type { AnalyzeResumeAndJobDescriptionOutput, OptimizeContentOutput } from '@/ai/schemas';

export async function performGapAnalysis(
  resumeText: string,
  jobDescriptionText: string,
  isFresher: boolean
): Promise<AnalyzeResumeAndJobDescriptionOutput> {
  if (!resumeText || !jobDescriptionText) {
    throw new Error('Resume and Job Description cannot be empty.');
  }
  try {
    const resumeAnalysis = await analyzeResume({ resumeText });
    const result = await analyzeResumeAndJobDescription({ resumeAnalysis, jobDescriptionText, isFresher });
    return result;
  } catch(e) {
    console.error(e);
    throw new Error("Failed to analyze resume. The AI model might be unavailable.");
  }
}

export async function performContentOptimization(
  resumeContent: string,
  jobDescription: string,
  identifiedGaps: string,
  isFresher: boolean
): Promise<OptimizeContentOutput> {
  if (!resumeContent || !jobDescription) {
    throw new Error('Missing required data for optimization.');
  }
   try {
    const resumeAnalysis = await analyzeResume({ resumeText: resumeContent });
    const result = await optimizeContent({ resumeContent, jobDescription, identifiedGaps, isFresher, resumeAnalysis });
    return result;
  } catch(e) {
    console.error(e);
    throw new Error("Failed to optimize resume. The AI model might be unavailable.");
  }
}
