'use server';

/**
 * @fileOverview Generates a weekly progress report summarizing task completion, upcoming deadlines, and overall project status.
 *
 * - generateWeeklyProgressReportFlow - A flow that generates the report.
 * - GenerateWeeklyProgressReportInput - The input type for the generateWeeklyProgressReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {generate} from 'genkit/generate';

export const GenerateWeeklyProgressReportInputSchema = z.object({
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

export const generateWeeklyProgressReportFlow = ai.defineFlow(
  {
    name: 'generateWeeklyProgressReportFlow',
    inputSchema: GenerateWeeklyProgressReportInputSchema,
    outputSchema: z.string(),
  },
  async input => {
    const prompt = `You are a project manager tasked with creating a concise weekly progress report.

  Summarize the provided information into a well-structured report that includes:

  - A summary of completed tasks.
  - A list of upcoming deadlines.
  - An overview of the overall project status.

  Use a professional and clear tone. The report should be easily understandable for stakeholders.

  Completed Tasks: ${input.taskCompletionSummary}
  Upcoming Deadlines: ${input.upcomingDeadlines}
  Overall Project Status: ${input.overallProjectStatus}
  `;

    const {output} = await generate({
      prompt,
      model: ai.model,
      output: {
        format: 'text',
      },
    });
    return output!;
  }
);
