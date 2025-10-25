'use client';

import { useActions } from '@genkit-ai/next/use-actions';
import { generateReportAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2, MessageSquare } from 'lucide-react';
import { GenerateWeeklyProgressReportInputSchema } from '@/ai/flows/generate-weekly-progress-report';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Bot className="mr-2 h-4 w-4" />
          Generate Report
        </>
      )}
    </Button>
  );
}

type ReportGeneratorProps = {
  defaultSummary?: string;
  defaultDeadlines?: string;
  defaultStatus?: string;
};

export function ReportGenerator({ defaultSummary, defaultDeadlines, defaultStatus }: ReportGeneratorProps) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const { last, isStreaming, run } = useActions<typeof GenerateWeeklyProgressReportInputSchema, string>({
    action: generateReportAction,
    onFinish: (result) => {
      if (result.status === 'error') {
        toast({
          title: "Error",
          description: result.error.message || "Failed to generate report.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: "Report generated successfully.",
        });
      }
    }
  });

  const handleFormSubmit = async (formData: FormData) => {
    const validatedFields = GenerateWeeklyProgressReportInputSchema.safeParse({
        taskCompletionSummary: formData.get('taskCompletionSummary'),
        upcomingDeadlines: formData.get('upcomingDeadlines'),
        overallProjectStatus: formData.get('overallProjectStatus'),
    });

    if (!validatedFields.success) {
      const fieldErrors = validatedFields.error.flatten().fieldErrors;
      let errorMsg = 'Please check the form for errors.';
      if (fieldErrors.taskCompletionSummary) {
        errorMsg = fieldErrors.taskCompletionSummary[0];
      } else if (fieldErrors.upcomingDeadlines) {
        errorMsg = fieldErrors.upcomingDeadlines[0];
      } else if (fieldErrors.overallProjectStatus) {
        errorMsg = fieldErrors.overallProjectStatus[0];
      }
      toast({
        title: "Validation Error",
        description: errorMsg,
        variant: "destructive",
      });
      return;
    }
    
    await run(validatedFields.data);
  };


  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <form action={handleFormSubmit} ref={formRef}>
          <CardHeader>
            <CardTitle>Generate Weekly Report</CardTitle>
            <CardDescription>
              The fields below are pre-filled with project data. Click "Generate Report" to start.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="taskCompletionSummary">Task Completion Summary</Label>
              <Textarea
                id="taskCompletionSummary"
                name="taskCompletionSummary"
                placeholder="e.g., Completed the design mockups for the new dashboard..."
                rows={4}
                defaultValue={defaultSummary}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="upcomingDeadlines">Upcoming Deadlines</Label>
              <Textarea
                id="upcomingDeadlines"
                name="upcomingDeadlines"
                placeholder="e.g., Final version of the landing page is due EOD Friday..."
                rows={3}
                defaultValue={defaultDeadlines}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="overallProjectStatus">Overall Project Status</Label>
              <Textarea
                id="overallProjectStatus"
                name="overallProjectStatus"
                placeholder="e.g., The project is on track. The development team is currently..."
                rows={3}
                defaultValue={defaultStatus}
              />
            </div>
          </CardContent>
          <CardFooter>
             <Button type="submit" disabled={isStreaming}>
              {isStreaming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Bot className="mr-2 h-4 w-4" />
                  Generate Report
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Generated Report</CardTitle>
          <CardDescription>The AI-generated report will appear below.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4">
          {isStreaming && !last && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {last?.output && (
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap rounded-md bg-muted p-4">
              {last.output}
            </div>
          )}
          {!isStreaming && !last?.output && (
            <div className="flex items-center justify-center h-full text-center text-muted-foreground p-4">
              <p>Your report will be displayed here once generated.</p>
            </div>
          )}
          {last?.output && (
             <div className="space-y-3 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                <p className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Mentor Feedback
                </p>
                <div className="space-y-2">
                    <Textarea id="feedback-text" placeholder="Provide feedback for your mentee..." rows={3}/>
                    <Button size="sm">Submit Feedback</Button>
                </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
