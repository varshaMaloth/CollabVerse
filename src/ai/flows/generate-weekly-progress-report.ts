'use server';

/**
 * @fileOverview Generates a weekly progress report summarizing task completion, upcoming deadlines, and overall project status.
 *
 * - generateWeeklyProgressReportFlow - A flow that generates the report.
 * - GenerateWeeklyProgressReportInput - The input type for the generateWeeklyProgressReport function.
 */

import {ai} from '@/ai/genkit';
import { GenerateWeeklyProgressReportInputSchema } from '@/app/actions';
import {z} from 'genkit';

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

    const result = await ai.generate({
      prompt,
      model: 'googleai/gemini-2.5-flash',
      output: {
        format: 'text',
      },
    });
    return result.text;
  }
);
