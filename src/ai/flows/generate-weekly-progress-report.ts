'use server';

/**
 * @fileOverview Generates a weekly progress report summarizing task completion, upcoming deadlines, and overall project status.
 *
 * - generateWeeklyProgressReport - A function that generates the report.
 * - GenerateWeeklyProgressReportInput - The input type for the generateWeeklyProgressReport function.
 * - GenerateWeeklyProgressReportOutput - The return type for the generateWeeklyProgressReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWeeklyProgressReportInputSchema = z.object({
  taskCompletionSummary: z
    .string()
    .describe('A summary of the tasks completed during the week.'),
  upcomingDeadlines: z
    .string()
    .describe('A list of upcoming project deadlines.'),
  overallProjectStatus: z
    .string()
    .describe('A summary of the overall project status.'),
});

export type GenerateWeeklyProgressReportInput = z.infer<
  typeof GenerateWeeklyProgressReportInputSchema
>;

const GenerateWeeklyProgressReportOutputSchema = z.object({
  report: z.string().describe('The generated weekly progress report.'),
});

export type GenerateWeeklyProgressReportOutput = z.infer<
  typeof GenerateWeeklyProgressReportOutputSchema
>;

export async function generateWeeklyProgressReport(
  input: GenerateWeeklyProgressReportInput
): Promise<GenerateWeeklyProgressReportOutput> {
  return generateWeeklyProgressReportFlow(input);
}

const generateWeeklyProgressReportPrompt = ai.definePrompt({
  name: 'generateWeeklyProgressReportPrompt',
  input: {schema: GenerateWeeklyProgressReportInputSchema},
  output: {schema: GenerateWeeklyProgressReportOutputSchema},
  prompt: `You are a project manager tasked with creating a concise weekly progress report.

  Summarize the provided information into a well-structured report that includes:

  - A summary of completed tasks.
  - A list of upcoming deadlines.
  - An overview of the overall project status.

  Use a professional and clear tone. The report should be easily understandable for stakeholders.

  Completed Tasks: {{{taskCompletionSummary}}}
  Upcoming Deadlines: {{{upcomingDeadlines}}}
  Overall Project Status: {{{overallProjectStatus}}}
  `,
});

const generateWeeklyProgressReportFlow = ai.defineFlow(
  {
    name: 'generateWeeklyProgressReportFlow',
    inputSchema: GenerateWeeklyProgressReportInputSchema,
    outputSchema: GenerateWeeklyProgressReportOutputSchema,
  },
  async input => {
    const {output} = await generateWeeklyProgressReportPrompt(input);
    return output!;
  }
);
