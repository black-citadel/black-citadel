import { clsx } from 'clsx';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ 
  title, 
  description, 
  icon, 
  action, 
  className 
}: EmptyStateProps) {
  return (
    <div className={clsx("p-8 text-center", className)}>
      {icon && (
        <div className="mx-auto flex items-center justify-center w-12 h-12 mb-4">
          {icon}
        </div>
      )}
      <h3 className="mt-2 text-sm font-semibold text-zinc-500">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-zinc-700">{description}</p>
      )}
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
}