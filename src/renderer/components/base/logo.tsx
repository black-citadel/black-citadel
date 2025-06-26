import clsx from 'clsx'
import logoMark from '@assets/logo-mark.svg'

export function Logo({ className }: React.ComponentPropsWithoutRef<'img'>) {
    return (
      <img
        src={logoMark}
        alt="Black Citadel"
        className={clsx(className, 'w-16 h-16')}
      />
    )
  }