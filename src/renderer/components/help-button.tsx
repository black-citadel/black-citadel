import { useView } from "@context/viewProvider"
import { InformationCircleIcon } from "@heroicons/react/24/outline"

interface Props {
  title: string;
  content: React.ReactNode;
}

export const HelpButton = ({ title, content }: Props): JSX.Element => {
  const { setDrawerOpen, setHelpTitle, setHelpContent } = useView()

  const handleHelp = () => {
    setHelpTitle(title)
    setHelpContent(content)   
    setDrawerOpen(true)
  };

  return (
    <InformationCircleIcon 
      className="ml-2 w-5 h-5 inline-block cursor-pointer" 
      onClick={() => handleHelp()} 
    />
  )
}
