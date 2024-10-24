import { Resources } from "@utils/enums";
import { StatefulSetBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
  namespace: string;
}

export const StatefulSetResourceLink = ({ name, namespace }: Props): JSX.Element => {
  return (
    <>
      <StatefulSetBadge />
      <ResourceLink resource={Resources.StatefulSets} name={name} namespace={namespace} />
    </>
  )
}