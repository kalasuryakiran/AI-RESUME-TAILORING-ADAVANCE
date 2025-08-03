'use server';
/**
 * @fileOverview This file contains the Genkit flow for analyzing a resume and job description to identify missing keywords, skills, and action verbs.
 *
 * - analyzeGaps - A function that takes resume and job description as input and returns the analysis.
 */

import {ai} from '@/ai/genkit';
import {AnalyzeResumeAndJobDescriptionInputSchema, AnalyzeResumeAndJobDescriptionOutputSchema, type AnalyzeResumeAndJobDescriptionInput, type AnalyzeResumeAndJobDescriptionOutput} from '@/ai/schemas';

export async function analyzeGaps(
  input: AnalyzeResumeAndJobDescriptionInput
): Promise<AnalyzeResumeAndJobDescriptionOutput> {
  return analyzeGapsFlow(input);
}

const analyzeGapsPrompt = ai.definePrompt({
  name: 'analyzeGapsPrompt',
  input: {schema: AnalyzeResumeAndJobDescriptionInputSchema},
  output: {schema: AnalyzeResumeAndJobDescriptionOutputSchema},
  prompt: `You are an expert career coach specializing in Applicant Tracking Systems (ATS).
  {{#if isFresher}}
  You are analyzing a resume for a fresher. Focus on identifying missing skills, relevant coursework, project experience, and internships that align with the job description. Acknowledge that extensive work history may be absent.
  {{/if}}

  Your task is to analyze a resume against a job description and identify gaps in keywords, skills, and action verbs.

  Specifically:
  1. Extract key skills, keywords, and action verbs from the job description.
  2. Check if these keywords, skills, and action verbs are present in the resume text.
  3. List the keywords, skills, and action verbs that are missing from the resume but are present in the job description.

  Job Description:
  {{{jobDescriptionText}}}

  Resume:
  {{{resumeText}}}

  Present the output as a JSON object with the following keys:
  - missingKeywords: An array of keywords missing from the resume.
  - missingSkills: An array of skills missing from the resume.
  - missingActionVerbs: An array of action verbs missing from the resume.

  Ensure the output is concise and directly addresses the missing elements.
  Output:
`,
});

const analyzeGapsFlow = ai.defineFlow(
  {
    name: 'analyzeGapsFlow',
    inputSchema: AnalyzeResumeAndJobDescriptionInputSchema,
    outputSchema: AnalyzeResumeAndJobDescriptionOutputSchema,
  },
  async input => {
    const {output} = await analyzeGapsPrompt(input);
    return output!;
  }
);
