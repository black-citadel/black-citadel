import { Heading } from "./base/heading"
import { Resources } from "@utils/enums";
import { ResourceHelp } from "@utils/help";
import { NamespaceDropdown } from "./namespace-dropdown";
import { ReactNode } from "react";

interface ListHeaderProps {
  resource: Resources
  error?: string | null
  actions?: ReactNode
  showNamespaceDropdown?: boolean
}

export const ListHeader = ({ 
  resource, 
  error, 
  actions,
  showNamespaceDropdown = false 
}: ListHeaderProps): JSX.Element => {
  return (
    <div className="border-b border-zinc-950/10 pb-3 dark:border-white/10">
      {error && (
        <div className="border border-red-700 text-red-700 px-2 py-1.5 rounded relative mb-4" role="alert">
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div className="flex w-full flex-wrap items-end justify-between gap-4">
        <Heading>{resource}</Heading>
        {showNamespaceDropdown && <NamespaceDropdown />}
      </div>

      <div className="flex items-start justify-between gap-4 py-3">
        <div className="text-zinc-500 text-sm flex-shrink min-w-0">
          <span className="block sm:inline">{ResourceHelp[resource]}</span>
        </div>
        {actions && (
          <div className="flex gap-2 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}