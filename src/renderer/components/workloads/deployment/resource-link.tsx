import { Resources } from "@utils/enums";
import { DeploymentBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
  namespace: string;
}

export const DeploymentResourceLink = ({ name, namespace }: Props): JSX.Element => {
  return (
    <>
      <DeploymentBadge />
      <ResourceLink resource={Resources.Deployments} name={name} namespace={namespace} />
    </>
  )
}