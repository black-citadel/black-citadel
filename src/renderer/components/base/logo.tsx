import React from 'react'
import clsx from 'clsx'
import LogoMark from '@assets/logo-mark.svg'

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
    return (
      <LogoMark
        className={clsx('w-16 h-16', className)}
        aria-label="Black Citadel"
        {...props}
      />
    )
  }