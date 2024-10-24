import { Resources } from "@utils/enums";
import { PodBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
  namespace: string;
}

export const PodResourceLink = ({ name, namespace }: Props): JSX.Element => {
  return (
    <>
      <PodBadge />
      <ResourceLink resource={Resources.Pods} name={name} namespace={namespace} />
    </>
  )
}