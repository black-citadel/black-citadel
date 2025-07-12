import { useState } from "react"
import { Button } from '@protoku/design-system'
import { Alert, AlertTitle, AlertActions } from './base/alert'

interface Props {
  children: React.ReactNode,
  error: string | null,
  onDelete?: () => void,
  actions?: React.ReactNode
}

export const DetailsHeader = ({ children, error, onDelete, actions }: Props): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {error && (
        <div className="border border-red-700 text-red-700 px-2 py-1.5 rounded relative mb-4" role="alert">
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div className="flex w-full flex-wrap items-center justify-between gap-4 border-b border-neutral-800 mb-4">
        {children}
        <div className="flex gap-4">
          {actions}
          {onDelete && <Button variant="caution" onClick={() => setIsOpen(true)}>Delete</Button>}
        </div>
      </div>

      <Alert open={isOpen} onClose={setIsOpen}>
        <AlertTitle>Are you sure you want to delete this resource?</AlertTitle>
        <AlertActions>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="caution" onClick={onDelete}>Delete</Button>
        </AlertActions>
      </Alert>
    </>
  )
}