import { Resources } from "@utils/enums";
import { ReplicaSetBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
  namespace: string;
}

export const ReplicaSetResourceLink = ({ name, namespace }: Props): JSX.Element => {
  return (
    <>
      <ReplicaSetBadge />
      <ResourceLink resource={Resources.ReplicaSets} name={name} namespace={namespace} />
    </>
  )
}