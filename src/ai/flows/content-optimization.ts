'use server';
/**
 * @fileOverview An AI agent that optimizes resume content based on job description and identified gaps.
 *
 * - optimizeContent - A function that optimizes the resume content.
 */

import {ai} from '@/ai/genkit';
import {OptimizeContentInputSchema, OptimizeContentOutputSchema, type OptimizeContentInput, type OptimizeContentOutput, ResumeAnalysisOutputSchema} from '@/ai/schemas';

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

  Based on the provided resume content, job description, and identified gaps, rewrite and optimize the resume content to achieve a 100% ATS score.
  You MUST aggressively change the content of the resume to fully align with the job description.
  Rephrase sentences, expand on projects, and add all relevant keywords to maximize the resume's matching to the job description.

  Return two versions of the optimized content:
  1.  'optimizedContent': A single string formatted as a clean, professional resume that a user can copy-paste.
  2.  'optimizedContentStructured': A JSON object with the structure defined by the output schema (name, contact, summary, skills, experiences, and education).

  Original Resume Content: {{{resumeContent}}}
  Job Description: {{{jobDescription}}}
  Identified Gaps: {{{identifiedGaps}}}

  Your final output will be a perfectly formatted resume template in both string and structured format. Ensure the optimized content is well-structured, professional, and easy to read for both humans and ATS systems.
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
    // First, analyze the original resume to get a structured version.
    const resumeAnalysis = await ai.run('resumeAnalysisFlow', { resumeText: input.resumeContent });

    const {output} = await optimizeContentPrompt(input);

    if (!output) {
      throw new Error('Optimization failed to produce an output.');
    }
    
    // To ensure the output is valid, we can try to parse it against the schema.
    // This adds a layer of validation.
    try {
      const validatedOutput = OptimizeContentOutputSchema.parse(output);
      return validatedOutput;
    } catch (e) {
      console.error("Generated content failed validation:", e);
      throw new Error("The AI generated an invalid resume structure. Please try again.");
    }
  }
);
