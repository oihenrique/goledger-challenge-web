import { Card, CardContent, CardHeader } from '@/components/ui';
import { Skeleton } from '@/components/ui';

export function TvShowRelationsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-16 bg-[#2a2c31]" />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, columnIndex) => (
          <Card
            key={columnIndex}
            className="rounded-3xl border border-white/10 bg-card py-0 shadow-none ring-0"
          >
            <CardHeader className="space-y-3 px-5 py-5">
              <Skeleton className="h-6 w-40 bg-[#31343a]" />
              <Skeleton className="h-5 w-56 bg-[#2a2c31]" />
            </CardHeader>
            <CardContent className="space-y-4 px-5 pb-5">
              {Array.from({ length: 3 }).map((_, itemIndex) => (
                <div
                  key={itemIndex}
                  className="space-y-3 rounded-2xl border border-white/10 p-4"
                >
                  <Skeleton className="h-5 w-24 bg-[#2a2c31]" />
                  <Skeleton className="h-6 w-3/4 bg-[#31343a]" />
                  <Skeleton className="h-4 w-full bg-[#2a2c31]" />
                  <Skeleton className="h-4 w-2/3 bg-[#2a2c31]" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
