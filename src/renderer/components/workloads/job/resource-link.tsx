import { Resources } from "@utils/enums";
import { JobBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
  namespace: string;
}

export const JobResourceLink = ({ name, namespace }: Props): JSX.Element => {
  return (
    <>
      <JobBadge />
      <ResourceLink resource={Resources.Jobs} name={name} namespace={namespace} />
    </>
  )
}