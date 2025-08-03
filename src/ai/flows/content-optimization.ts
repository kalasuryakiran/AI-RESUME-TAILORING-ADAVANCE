'use server';
/**
 * @fileOverview An AI agent that optimizes resume content based on job description and identified gaps.
 *
 * - optimizeContent - A function that optimizes the resume content.
 */

import {ai} from '@/ai/genkit';
import {OptimizeContentInputSchema, OptimizeContentOutputSchema, type OptimizeContentInput, type OptimizeContentOutput} from '@/ai/schemas';

export async function optimizeContent(input: OptimizeContentInput): Promise<OptimizeContentOutput> {
  return optimizeContentFlow(input);
}

const optimizeContentPrompt = ai.definePrompt({
  name: 'optimizeContentPrompt',
  input: {schema: OptimizeContentInputSchema},
  output: {schema: OptimizeContentOutputSchema},
  prompt: `You are an expert resume writer and career coach, specializing in ATS optimization to achieve a perfect 100 ATS score.
  You will act as a resume building agent. Your primary goal is to rewrite and enhance the user's resume based on a thorough analysis of their existing resume, the target job description, and identified gaps.

  {{#if isFresher}}
  You are creating a resume for a fresher. Focus on highlighting potential, transferable skills, academic projects, and internships. De-emphasize the lack of professional experience. The resume should be tailored for an entry-level position.
  {{/if}}

  Based on the provided resume content, job description, structured resume analysis, and identified gaps, rewrite and optimize the resume content to achieve a 100% ATS score.
  You MUST aggressively change the content of the resume to fully align with the job description.
  Rephrase sentences, expand on projects, and add all relevant keywords to maximize the resume's matching to the job description. Use the structured analysis to ensure you don't lose key information from the original resume.

  Original Resume Content: {{{resumeContent}}}
  Job Description: {{{jobDescription}}}
  Identified Gaps: {{{identifiedGaps}}}
  Structured Resume Analysis:
  - Skills: {{#each resumeAnalysis.skills}}{{this}}, {{/each}}
  - Experience: {{#each resumeAnalysis.experiences}}{{this.title}} at {{this.company}} - {{this.description}}{{/each}}
  - Education: {{#each resumeAnalysis.education}}{{this.degree}} from {{this.school}}{{/each}}

  Your final output will be a perfectly formatted resume template. Ensure the optimized content is well-structured, professional, and easy to read for both humans and ATS systems.
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
