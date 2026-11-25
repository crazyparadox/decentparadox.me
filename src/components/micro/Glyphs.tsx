// Micrographic glyphs.

/** Row of dots, filled proportionally to `value` (0–1). */
export const DotMeter = ({ value, cells = 20, className }: { value: number; cells?: number; className?: string }) => {
  const filled = Math.max(1, Math.round(value * cells))
  return (
    <span className={`inline-flex items-center gap-[3px] ${className ?? ''}`} aria-hidden="true">
      {Array.from({ length: cells }).map((_, i) => (
        <span
          key={i}
          className="block size-[4px] rounded-full bg-current"
          style={{ opacity: i < filled ? 1 : 0.15 }}
        />
      ))}
    </span>
  )
}
