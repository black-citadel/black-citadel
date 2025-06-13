import React from 'react'

export function SidebarLayout({ sidebar, children }: React.PropsWithChildren<{ sidebar: React.ReactNode }>) {
  return (
    <div className="relative flex h-screen w-full bg-white max-lg:flex-col lg:bg-neutral-100 dark:bg-[#08090a] p-2">

      <div className="fixed inset-y-0 left-0 w-80 h-full overflow-y-auto">
        {sidebar}
      </div>

      <main className="flex-1 overflow-y-auto pl-80">
        <div className="min-h-full p-4 bg-white text-neutral-900 dark:bg-[#101010] dark:text-white border border-neutral-800">
          <div className="w-full">
            {children}
          </div>
        </div>
      </main>

    </div>
  )
}
