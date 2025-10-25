'use server';

import { generateWeeklyProgressReport } from '@/ai/flows/generate-weekly-progress-report';
import { z } from 'zod';

const ReportSchema = z.object({
  taskCompletionSummary: z.string().min(10, { message: 'Please provide a more detailed summary.' }),
  upcomingDeadlines: z.string().min(10, { message: 'Please provide more details on deadlines.' }),
  overallProjectStatus: z.string().min(10, { message: 'Please provide a more detailed status.' }),
});

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

export async function generateReportAction(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = ReportSchema.safeParse({
    taskCompletionSummary: formData.get('taskCompletionSummary'),
    upcomingDeadlines: formData.get('upcomingDeadlines'),
    overallProjectStatus: formData.get('overallProjectStatus'),
  });

  if (!validatedFields.success) {
    return {
      status: 'error',
      message: 'Please check the form for errors.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await generateWeeklyProgressReport(validatedFields.data);
    return {
      status: 'success',
      message: 'Report generated successfully!',
      report: result.report,
    };
  } catch (error) {
    return {
      status: 'error',
      message: 'Failed to generate report. Please try again.',
    };
  }
}
