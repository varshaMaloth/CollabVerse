import { Briefcase } from 'lucide-react';

type LoadingProps = {
  text?: string;
};

export function Loading({ text = 'Loading...' }: LoadingProps) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-16 w-16 animate-pulse rounded-full bg-primary/20"></div>
        <div className="absolute h-24 w-24 animate-pulse rounded-full bg-primary/10 [animation-delay:0.2s]"></div>
        <Briefcase className="h-12 w-12 text-primary animate-pulse" />
      </div>
      <p className="mt-6 text-lg font-semibold text-foreground">{text}</p>
    </div>
  );
}
