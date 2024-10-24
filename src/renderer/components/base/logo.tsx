import clsx from 'clsx'

export function Logo({ className }: React.ComponentPropsWithoutRef<'p'>) {
    return (
      <p
        className={clsx(className, 'text-base/6 text-zinc-500 sm:text-sm/6 dark:text-zinc-400')}
      >
        Logo
        </p>
    )
  }