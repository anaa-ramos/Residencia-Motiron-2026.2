export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`rounded bg-slate-200 motion-safe:animate-pulse ${className}`} />
}

export function SkeletonCard() {
  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-40" />
    </div>
  )
}

export function SkeletonTabela({ linhas = 4, colunas = 4 }: { linhas?: number; colunas?: number }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex gap-4 border-b border-slate-200 px-4 py-3">
        {Array.from({ length: colunas }, (_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: linhas }, (_, l) => (
        <div key={l} className="flex gap-4 border-b border-slate-100 px-4 py-4 last:border-0">
          {Array.from({ length: colunas }, (_, c) => (
            <Skeleton key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}
