'use server';
/**
 * @fileOverview An AI agent that analyzes and extracts structured information from a resume.
 *
 * - analyzeResume - A function that extracts structured data from resume text.
 */

import {ai} from '@/ai/genkit';
import {ResumeAnalysisInputSchema, ResumeAnalysisOutputSchema, type ResumeAnalysisInput, type ResumeAnalysisOutput} from '@/ai/schemas';


export async function analyzeResume(input: ResumeAnalysisInput): Promise<ResumeAnalysisOutput> {
  return resumeAnalysisFlow(input);
}

const resumeAnalysisPrompt = ai.definePrompt({
  name: 'resumeAnalysisPrompt',
  input: {schema: ResumeAnalysisInputSchema},
  output: {schema: ResumeAnalysisOutputSchema},
  prompt: `You are an expert resume parser. Your task is to analyze the provided resume text and extract structured information from it.

  Resume Text:
  {{{resumeText}}}

  Extract the following information and provide it in a structured JSON format:
  - name: The full name of the person.
  - contact: An object containing email, phone, linkedin, github, and website URLs if available.
  - summary: A professional summary or objective statement.
  - skills: A list of all skills mentioned.
  - experiences: A list of all work or project experiences, including title, company/context, and a description.
  - education: A list of all educational entries, including degree, school, and year.
  `,
});

const resumeAnalysisFlow = ai.defineFlow(
  {
    name: 'resumeAnalysisFlow',
    inputSchema: ResumeAnalysisInputSchema,
    outputSchema: ResumeAnalysisOutputSchema,
  },
  async input => {
    const {output} = await resumeAnalysisPrompt(input);
    return output!;
  }
);
