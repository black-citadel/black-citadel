import { Resources, ResourceAction } from "@utils/enums";
import { useView } from "@context/viewProvider";
import { CustomResourceBadge } from "./badge";

interface Props {
  name: string;
  namespace?: string;
  group: string;
  version: string;
  plural: string;
  kind: string;
}

export const CustomResourceLink = ({ name, namespace, group, version, plural, kind }: Props): JSX.Element => {
  const { setViewContext } = useView();

  const handleClick = () => {
    setViewContext({
      resource: Resources.CustomResources,
      action: ResourceAction.Details,
      name,
      namespace,
      customResource: {
        group,
        version,
        plural,
        kind
      }
    });
  };

  return (
    <>
      <CustomResourceBadge plural={plural} group={group} kind={kind} /> 
      <button
        className='text-blue-500'
        onClick={handleClick}
      >
        {name}
      </button>
    </>
  );
};