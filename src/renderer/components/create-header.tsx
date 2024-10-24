import { Heading } from "./base/heading"

interface Props {
  children: React.ReactNode,
  error: string | null
}

export const CreateHeader = ({ children, error }: Props): JSX.Element => {

  return (
    <div className="border-b border-zinc-950/10 pb-3 dark:border-white/10 mb-3">
      {error && (
        <div className="border border-red-700 text-red-700 px-2 py-1.5 rounded relative mb-4" role="alert">
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div className="flex w-full flex-wrap items-end justify-between gap-4">
        <Heading>{children}</Heading>
      </div>
    </div>
  )
}