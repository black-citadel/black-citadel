import { Resources } from "@utils/enums";
import { DaemonSetBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
  namespace: string;
}

export const DaemonSetResourceLink = ({ name, namespace }: Props): JSX.Element => {
  return (
    <>
      <DaemonSetBadge />
      <ResourceLink resource={Resources.DaemonSets} name={name} namespace={namespace} />
    </>
  )
}