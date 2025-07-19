import { useView } from '@context/viewProvider';
import { Resources, ResourceAction } from '@utils/enums';
import { HelmBadge } from './badge';

interface HelmResourceLinkProps {
  name: string;
  namespace: string;
}

export const HelmResourceLink = ({ name, namespace }: HelmResourceLinkProps): JSX.Element => {
  const { setViewContext } = useView();

  const handleClick = () => {
    setViewContext({
      resource: Resources.Helm,
      action: ResourceAction.Details,
      name,
      namespace
    });
  };

  return (
    <div className="flex items-center">
      <HelmBadge />
      <span 
        className="text-blue-500 hover:text-blue-400 cursor-pointer"
        onClick={handleClick}
      >
        {name}
      </span>
    </div>
  );
};