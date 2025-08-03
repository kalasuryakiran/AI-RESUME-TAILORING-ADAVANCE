import {z} from 'genkit';

export const AnalyzeResumeAndJobDescriptionInputSchema = z.object({
  resumeText: z.string().describe('The raw text content of the resume.'),
  jobDescriptionText: z.string().describe('The text content of the job description.'),
  isFresher: z.boolean().describe('Whether the resume is for a fresher.'),
});
export type AnalyzeResumeAndJobDescriptionInput = z.infer<typeof AnalyzeResumeAndJobDescriptionInputSchema>;

export const AnalyzeResumeAndJobDescriptionOutputSchema = z.object({
  missingKeywords: z.array(z.string()).describe('Keywords present in the job description but missing from the resume.'),
  missingSkills: z.array(z.string()).describe('Skills mentioned in the job description but not found in the resume.'),
  missingActionVerbs: z.array(z.string()).describe('Action verbs used in the job description but absent in the resume.'),
});
export type AnalyzeResumeAndJobDescriptionOutput = z.infer<typeof AnalyzeResumeAndJobDescriptionOutputSchema>;

export const OptimizeContentInputSchema = z.object({
  resumeContent: z.string().describe('The content of the resume to be optimized.'),
  jobDescription: z.string().describe('The job description to match the resume to.'),
  identifiedGaps: z.string().describe('The identified gaps in the resume content.'),
  isFresher: z.boolean().describe('Whether the resume is for a fresher.'),
});
export type OptimizeContentInput = z.infer<typeof OptimizeContentInputSchema>;

const ExperienceSchema = z.object({
  title: z.string().describe('Job title.'),
  company: z.string().describe('Company name.'),
  description: z.string().describe('Description of responsibilities and achievements.'),
});

const EducationSchema = z.object({
  degree: z.string().describe('Degree or certification name.'),
  school: z.string().describe('Name of the school or institution.'),
  year: z.string().optional().describe('Year of graduation or completion.'),
});

const ResumeAnalysisOutputSchema = z.object({
  name: z.string().describe('Full name.'),
  contact: z.object({
    email: z.string().optional().describe('Email address.'),
    phone: z.string().optional().describe('Phone number.'),
    linkedin: z.string().optional().describe('LinkedIn profile URL.'),
    github: z.string().optional().describe('GitHub profile URL.'),
    website: z.string().optional().describe('Personal website or portfolio URL.'),
  }).describe('Contact information.'),
  summary: z.string().describe('A brief professional summary.'),
  skills: z.array(z.string()).describe('A list of skills extracted from the resume.'),
  experiences: z.array(ExperienceSchema).describe('A list of professional experiences.'),
  education: z.array(EducationSchema).describe('A list of educational qualifications.'),
});

export const OptimizeContentOutputSchema = z.object({
  optimizedContent: z.string().describe('The optimized resume content as a single string.'),
  optimizedContentStructured: ResumeAnalysisOutputSchema.describe('The optimized resume content in a structured format.'),
});
export type OptimizeContentOutput = z.infer<typeof OptimizeContentOutputSchema>;
