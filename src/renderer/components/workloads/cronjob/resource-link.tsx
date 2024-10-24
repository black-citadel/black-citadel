import { Resources } from "@utils/enums";
import { CronJobBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
  namespace: string;
}

export const CronJobResourceLink = ({ name, namespace }: Props): JSX.Element => {
  return (
    <>
      <CronJobBadge />
      <ResourceLink resource={Resources.CronJobs} name={name} namespace={namespace} />
    </>
  )
}