'use server';

import { analyzeResumeAndJobDescription } from '@/ai/flows/gap-analysis';
import { optimizeContent } from '@/ai/flows/content-optimization';
import { analyzeResume } from '@/ai/flows/resume-analysis';
import type { AnalyzeResumeAndJobDescriptionOutput, OptimizeContentOutput, ResumeAnalysisOutput } from '@/ai/schemas';

export async function performGapAnalysis(
  resumeText: string,
  jobDescriptionText: string,
  isFresher: boolean
): Promise<{ gapAnalysis: AnalyzeResumeAndJobDescriptionOutput; resumeAnalysis: ResumeAnalysisOutput }> {
  if (!resumeText || !jobDescriptionText) {
    throw new Error('Resume and Job Description cannot be empty.');
  }
  try {
    const resumeAnalysis = await analyzeResume({ resumeText });
    const gapAnalysis = await analyzeResumeAndJobDescription({ resumeAnalysis, jobDescriptionText, isFresher });
    return { gapAnalysis, resumeAnalysis };
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
  resumeAnalysis: ResumeAnalysisOutput
): Promise<OptimizeContentOutput> {
  if (!resumeContent || !jobDescription) {
    throw new Error('Missing required data for optimization.');
  }
   try {
    const result = await optimizeContent({ resumeContent, jobDescription, identifiedGaps, isFresher, resumeAnalysis });
    return result;
  } catch(e) {
    console.error(e);
    throw new Error("Failed to optimize resume. The AI model might be unavailable.");
  }
}

export async function getResumeAnalysis(resumeText: string): Promise<ResumeAnalysisOutput> {
  if (!resumeText) {
    throw new Error('Resume cannot be empty.');
  }
  try {
    return await analyzeResume({ resumeText });
  } catch (e) {
    console.error(e);
    throw new Error('Failed to analyze resume. The AI model might be unavailable.');
  }
}
