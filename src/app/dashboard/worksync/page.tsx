import { PomodoroTimer } from "@/components/worksync/pomodoro-timer";
import { Notepad } from "@/components/worksync/notepad";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function WorkSyncPage() {
  return (
    <div className="space-y-6">
       <div>
        <h2 className="text-3xl font-bold tracking-tight">Work Sync</h2>
        <p className="text-muted-foreground">
          Tools to help you focus and stay productive.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <PomodoroTimer />
        <Notepad />
      </div>
    </div>
  );
}
