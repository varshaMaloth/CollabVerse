'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { generateReportAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2 } from 'lucide-react';

const initialState = {
  status: 'idle' as const,
  message: '',
};

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

export function ReportGenerator() {
  const [state, formAction] = useFormState(generateReportAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === 'success') {
      toast({
        title: "Success!",
        description: state.message,
      });
      formRef.current?.reset();
    } else if (state.status === 'error' && state.message && !state.fieldErrors) {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <form action={formAction} ref={formRef}>
          <CardHeader>
            <CardTitle>Generate Weekly Report</CardTitle>
            <CardDescription>
              Fill in the details below to automatically generate a progress report.
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
              />
              {state.fieldErrors?.taskCompletionSummary && (
                <p className="text-sm text-destructive">{state.fieldErrors.taskCompletionSummary[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="upcomingDeadlines">Upcoming Deadlines</Label>
              <Textarea
                id="upcomingDeadlines"
                name="upcomingDeadlines"
                placeholder="e.g., Final version of the landing page is due EOD Friday..."
                rows={3}
              />
              {state.fieldErrors?.upcomingDeadlines && (
                <p className="text-sm text-destructive">{state.fieldErrors.upcomingDeadlines[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="overallProjectStatus">Overall Project Status</Label>
              <Textarea
                id="overallProjectStatus"
                name="overallProjectStatus"
                placeholder="e.g., The project is on track. The development team is currently..."
                rows={3}
              />
              {state.fieldErrors?.overallProjectStatus && (
                <p className="text-sm text-destructive">{state.fieldErrors.overallProjectStatus[0]}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Generated Report</CardTitle>
          <CardDescription>The AI-generated report will appear below.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          {state.status === 'loading' && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {state.status === 'success' && state.report && (
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap rounded-md bg-muted p-4">
              {state.report}
            </div>
          )}
          {state.status === 'idle' && (
            <div className="flex items-center justify-center h-full text-center text-muted-foreground p-4">
              <p>Your report will be displayed here once generated.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
