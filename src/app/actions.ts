'use server';

import { generateWeeklyProgressReportFlow } from '@/ai/flows/generate-weekly-progress-report';
import { runFlow } from '@genkit-ai/next';
import { z } from 'zod';

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

export async function generateReportAction(input: GenerateWeeklyProgressReportInput) {
  return await runFlow(generateWeeklyProgressReportFlow, input);
}
