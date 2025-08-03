'use server';
/**
 * @fileOverview An AI agent that optimizes resume content based on job description and identified gaps.
 *
 * - optimizeContent - A function that optimizes the resume content.
 * - OptimizeContentInput - The input type for the optimizeContent function.
 * - OptimizeContentOutput - The return type for the optimizeContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeContentInputSchema = z.object({
  resumeContent: z.string().describe('The content of the resume to be optimized.'),
  jobDescription: z.string().describe('The job description to match the resume to.'),
  identifiedGaps: z.string().describe('The identified gaps in the resume content.'),
  isFresher: z.boolean().describe('Whether the resume is for a fresher.'),
});
export type OptimizeContentInput = z.infer<typeof OptimizeContentInputSchema>;

const OptimizeContentOutputSchema = z.object({
  optimizedContent: z.string().describe('The optimized resume content.'),
  atsScore: z.number().describe('The estimated ATS score for the optimized resume.'),
});
export type OptimizeContentOutput = z.infer<typeof OptimizeContentOutputSchema>;

export async function optimizeContent(input: OptimizeContentInput): Promise<OptimizeContentOutput> {
  return optimizeContentFlow(input);
}

const optimizeContentPrompt = ai.definePrompt({
  name: 'optimizeContentPrompt',
  input: {schema: OptimizeContentInputSchema},
  output: {schema: OptimizeContentOutputSchema},
  prompt: `You are an expert resume writer specializing in ATS optimization. Your goal is to achieve a perfect 100 ATS score.
  {{#if isFresher}}
  You are creating a resume for a fresher. Focus on highlighting potential, transferable skills, academic projects, and internships. De-emphasize the lack of professional experience. The resume should be tailored for an entry-level position.
  {{/if}}

  Based on the provided resume content, job description, and identified gaps, rewrite and optimize the resume content to achieve a 100% ATS score.
  You must change the content of the resume to fully align with the job description.
  Rephrase sentences and add all relevant keywords to maximize the resume's matching to the job description.

  Resume Content: {{{resumeContent}}}
  Job Description: {{{jobDescription}}}
  Identified Gaps: {{{identifiedGaps}}}

  Ensure the optimized content is well-structured and easy to read for both humans and ATS systems.
  The ATS score should be 100, reflecting a perfect match with the job description.
  `,
});

const optimizeContentFlow = ai.defineFlow(
  {
    name: 'optimizeContentFlow',
    inputSchema: OptimizeContentInputSchema,
    outputSchema: OptimizeContentOutputSchema,
  },
  async input => {
    const {output} = await optimizeContentPrompt(input);
    return output!;
  }
);
