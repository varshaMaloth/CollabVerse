'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, RotateCw } from 'lucide-react';

const modes = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
};

type Mode = keyof typeof modes;

export function PomodoroTimer() {
  const [mode, setMode] = useState<Mode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(modes[mode] * 60);
  const [isActive, setIsActive] = useState(false);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(modes[mode] * 60);
  }, [mode]);

  useEffect(() => {
    resetTimer();
  }, [mode, resetTimer]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Optional: Add a sound notification here
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, timeLeft]);


  const toggleIsActive = () => {
    setIsActive(!isActive);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / (modes[mode] * 60)) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pomodoro Timer</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
            <TabsTrigger value="shortBreak">Short Break</TabsTrigger>
            <TabsTrigger value="longBreak">Long Break</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="text-8xl font-bold tracking-tighter">
          {formatTime(timeLeft)}
        </div>
        <div className="w-full space-y-4">
          <Progress value={100 - progress} className="h-2" />
          <div className="flex justify-center gap-4">
            <Button onClick={toggleIsActive} size="lg" className="w-32">
              {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
              {isActive ? 'Pause' : 'Start'}
            </Button>
            <Button onClick={resetTimer} size="lg" variant="outline">
              <RotateCw className="mr-2 h-5 w-5" />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
