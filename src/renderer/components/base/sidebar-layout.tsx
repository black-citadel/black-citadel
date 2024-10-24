import React from 'react'

export function SidebarLayout({ sidebar, children }: React.PropsWithChildren<{ sidebar: React.ReactNode }>) {
  return (
    <div className="relative flex h-screen w-full bg-white max-lg:flex-col lg:bg-neutral-100 dark:bg-neutral-900">

      <div className="fixed inset-y-0 left-0 w-80 h-full overflow-y-auto border-r border-neutral-800">
        {sidebar}
      </div>

      <main className="flex-1 overflow-y-auto pl-80">
        <div className="min-h-full p-6 bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white">
          <div className="w-full">
            {children}
          </div>
        </div>
      </main>

    </div>
  )
}
