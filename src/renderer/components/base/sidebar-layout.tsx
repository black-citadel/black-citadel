import React from 'react'

export function SidebarLayout({ sidebar, children }: React.PropsWithChildren<{ sidebar: React.ReactNode }>) {
  return (
    <div className="relative flex h-screen w-full max-lg:flex-col bg-neutral-100 text-neutral-950 dark:bg-neutral-950 dark:text-white">

      <div className="fixed inset-y-0 left-0 w-80 h-full overflow-y-auto">
        {sidebar}
      </div>

      <main className="flex-1 overflow-y-auto pl-80">
        <div className="min-h-full p-4 border-l border-neutral-800">
          <div className="w-full">
            {children}
          </div>
        </div>
      </main>

    </div>
  )
}
