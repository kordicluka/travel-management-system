import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function RouteCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0 space-y-2">
            {/* Route title skeleton */}
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Route details skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <div className="flex items-center justify-center">
              <Skeleton className="h-4 w-4" />
            </div>
            <Skeleton className="h-4 w-full" />
          </div>

          {/* Stats badges skeleton */}
          <div className="flex gap-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-20" />
          </div>

          {/* Action buttons skeleton */}
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
