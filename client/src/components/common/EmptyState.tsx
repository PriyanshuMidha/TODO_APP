export const EmptyState = ({
  title,
  description,
  compact = false
}: {
  title: string;
  description: string;
  compact?: boolean;
}) => (
  <div
    className={`flex flex-col items-center justify-center text-center ${
      compact
        ? "rounded-2xl border border-border bg-card/40 px-4 py-5"
        : "h-full min-h-48 rounded-[24px] border border-dashed border-border bg-card/60 p-8"
    }`}
  >
    <h3 className={`${compact ? "text-sm" : "text-lg"} font-semibold text-textPrimary`}>
      {title}
    </h3>
    <p className={`mt-2 max-w-sm ${compact ? "text-xs" : "text-sm"} text-textSecondary`}>
      {description}
    </p>
  </div>
);
