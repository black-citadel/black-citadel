interface LogViewerProps {
  content: string
}

export const LogViewer = ({ content }: LogViewerProps): JSX.Element => {
  return (
    <div className="text-white bg-black mt-4 p-2 rounded-lg font-mono text-sm">
      {content}
    </div>
  )
}