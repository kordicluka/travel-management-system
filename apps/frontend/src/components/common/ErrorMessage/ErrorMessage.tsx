import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message?: string;
}

export function ErrorMessage({ title = 'Error', message = 'Something went wrong' }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="rounded-lg bg-destructive/10 p-4 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-destructive mb-2" />
        <h3 className="font-semibold text-destructive mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
