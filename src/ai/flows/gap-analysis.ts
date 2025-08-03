'use server';

/**
 * @fileOverview This file contains the Genkit flow for analyzing a resume and job description to identify missing keywords, skills, and action verbs.
 *
 * - analyzeResumeAndJobDescription - A function that takes resume and job description as input and returns the analysis.
 * - AnalyzeResumeAndJobDescriptionInput - The input type for the analyzeResumeAndJobDescription function.
 * - AnalyzeResumeAndJobDescriptionOutput - The return type for the analyzeResumeAndJobDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeResumeAndJobDescriptionInputSchema = z.object({
  resumeText: z.string().describe('The text content of the resume.'),
  jobDescriptionText: z.string().describe('The text content of the job description.'),
});

export type AnalyzeResumeAndJobDescriptionInput = z.infer<typeof AnalyzeResumeAndJobDescriptionInputSchema>;

const AnalyzeResumeAndJobDescriptionOutputSchema = z.object({
  missingKeywords: z.array(z.string()).describe('Keywords present in the job description but missing from the resume.'),
  missingSkills: z.array(z.string()).describe('Skills mentioned in the job description but not found in the resume.'),
  missingActionVerbs: z.array(z.string()).describe('Action verbs used in the job description but absent in the resume.'),
});

export type AnalyzeResumeAndJobDescriptionOutput = z.infer<typeof AnalyzeResumeAndJobDescriptionOutputSchema>;

export async function analyzeResumeAndJobDescription(
  input: AnalyzeResumeAndJobDescriptionInput
): Promise<AnalyzeResumeAndJobDescriptionOutput> {
  return analyzeResumeAndJobDescriptionFlow(input);
}

const analyzeResumeAndJobDescriptionPrompt = ai.definePrompt({
  name: 'analyzeResumeAndJobDescriptionPrompt',
  input: {schema: AnalyzeResumeAndJobDescriptionInputSchema},
  output: {schema: AnalyzeResumeAndJobDescriptionOutputSchema},
  prompt: `You are an expert career coach specializing in Applicant Tracking Systems (ATS).

  Your task is to analyze a resume against a job description and identify gaps in keywords, skills, and action verbs.

  Specifically:
  1. Extract key skills, keywords, and action verbs from the job description.
  2. Check if these keywords, skills, and action verbs are present in the resume.
  3. List the keywords, skills, and action verbs that are missing from the resume but are present in the job description.

  Job Description:
  {{jobDescriptionText}}

  Resume:
  {{resumeText}}

  Present the output as a JSON object with the following keys:
  - missingKeywords: An array of keywords missing from the resume.
  - missingSkills: An array of skills missing from the resume.
  - missingActionVerbs: An array of action verbs missing from the resume.

  Ensure the output is concise and directly addresses the missing elements.
  Output:
`,
});

const analyzeResumeAndJobDescriptionFlow = ai.defineFlow(
  {
    name: 'analyzeResumeAndJobDescriptionFlow',
    inputSchema: AnalyzeResumeAndJobDescriptionInputSchema,
    outputSchema: AnalyzeResumeAndJobDescriptionOutputSchema,
  },
  async input => {
    const {output} = await analyzeResumeAndJobDescriptionPrompt(input);
    return output!;
  }
);
