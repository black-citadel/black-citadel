import { Resources } from "@utils/enums";
import { ConfigMapBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
  namespace: string;
}

export const ConfigMapResourceLink = ({ name, namespace }: Props): JSX.Element => {
  return (
    <>
      <ConfigMapBadge />
      <ResourceLink resource={Resources.ConfigMaps} name={name} namespace={namespace} />
    </>
  )
}