'use server';
/**
 * @fileOverview This file contains the Genkit flow for calculating the ATS score of a resume against a job description.
 *
 * - calculateScore - A function that takes resume and job description as input and returns the score.
 */

import {ai} from '@/ai/genkit';
import {AtsScoreInputSchema, AtsScoreOutputSchema, type AtsScoreInput, type AtsScoreOutput} from '@/ai/schemas';

export async function calculateScore(input: AtsScoreInput): Promise<AtsScoreOutput> {
  return calculateScoreFlow(input);
}

const calculateScorePrompt = ai.definePrompt({
  name: 'calculateScorePrompt',
  input: {schema: AtsScoreInputSchema},
  output: {schema: AtsScoreOutputSchema},
  prompt: `You are a highly advanced Applicant Tracking System (ATS). Your only task is to analyze a resume against a job description and provide a score from 0 to 100.

  - A score of 0 means the resume is completely irrelevant to the job.
  - A score of 100 means the resume is a perfect match for the job description.

  Analyze the resume based on the presence of keywords, skills, qualifications, and relevant experience mentioned in the job description.

  Job Description:
  {{{jobDescriptionText}}}

  Resume:
  {{{resumeText}}}

  Provide only the score.
  Output:
`,
});

const calculateScoreFlow = ai.defineFlow(
  {
    name: 'calculateScoreFlow',
    inputSchema: AtsScoreInputSchema,
    outputSchema: AtsScoreOutputSchema,
  },
  async input => {
    const {output} = await calculateScorePrompt(input);
    return output!;
  }
);
