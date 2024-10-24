import { ResourceAction, Resources } from "@utils/enums";
import { useView } from '@context/viewProvider';

interface Props {
  resource: Resources,
  name: string;
  namespace?: string
}

export const ResourceLink = ({ resource, name, namespace }: Props): JSX.Element => {
  const { setViewContext } = useView();

  return (
    <>
      <button
        className='text-blue-500'
        onClick={() => setViewContext({ resource, action: ResourceAction.Details, name, namespace })}
      >
        {name}
      </button>
    </>
  )
}