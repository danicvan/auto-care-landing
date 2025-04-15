import { Skeleton } from "./ui/skeleton"

export default function LoadingSkeleton() {
  return (
    <div className="w-full">
      {/* Header Skeleton */}
      <div className="fixed w-full bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 z-50">
        <div className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-32" />
            <div className="hidden md:flex space-x-4">
              {Array(7)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-4 w-16" />
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Skeleton */}
      <div className="h-screen w-full">
        <Skeleton className="h-full w-full" />
      </div>

      {/* About Skeleton */}
      <div className="py-20 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <Skeleton className="h-10 w-64 mx-auto mb-8" />
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </div>

      {/* Services Skeleton */}
      <div className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <Skeleton className="h-10 w-64 mx-auto mb-12" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="p-6 rounded-lg">
                  <Skeleton className="h-12 w-12 mx-auto mb-4" />
                  <Skeleton className="h-6 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-full mx-auto" />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Plans Skeleton */}
      <div className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <Skeleton className="h-10 w-64 mx-auto mb-8" />
          <Skeleton className="h-6 w-48 mx-auto mb-8" />
          <div className="grid md:grid-cols-3 gap-8">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="rounded-lg p-8 shadow-xl">
                  <Skeleton className="h-8 w-32 mb-4" />
                  <Skeleton className="h-10 w-40 mb-6" />
                  <div className="space-y-2 mb-8">
                    {Array(4)
                      .fill(0)
                      .map((_, j) => (
                        <Skeleton key={j} className="h-4 w-full" />
                      ))}
                  </div>
                  <Skeleton className="h-10 w-full rounded-full" />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
