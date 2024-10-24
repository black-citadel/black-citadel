interface EditorProps {
  content: string
}

export const Editor = ({ content }: EditorProps): JSX.Element => {
  return (
    <div className="text-white mt-6 p-4 rounded-lg font-mono text-sm">
      <pre style={{
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        maxWidth: '100%',
      }}>{content}</pre>
    </div>
  )
}