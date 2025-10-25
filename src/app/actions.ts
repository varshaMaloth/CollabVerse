'use server';

import { generateWeeklyProgressReportFlow, GenerateWeeklyProgressReportInputSchema } from '@/ai/flows/generate-weekly-progress-report';
import { runFlow } from 'genkit/next';
import { z } from 'zod';

type State = {
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
  report?: string;
  fieldErrors?: {
    taskCompletionSummary?: string[];
    upcomingDeadlines?: string[];
    overallProjectStatus?: string[];
  };
};

export async function generateReportAction(formData: FormData) {
  const validatedFields = GenerateWeeklyProgressReportInputSchema.safeParse({
    taskCompletionSummary: formData.get('taskCompletionSummary'),
    upcomingDeadlines: formData.get('upcomingDeadlines'),
    overallProjectStatus: formData.get('overallProjectStatus'),
  });

  if (!validatedFields.success) {
    // This part is not fully utilized by the new implementation but kept for schema validation logic.
    return {
      status: 'error',
      message: 'Please check the form for errors.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  return runFlow(generateWeeklyProgressReportFlow, validatedFields.data);
}
