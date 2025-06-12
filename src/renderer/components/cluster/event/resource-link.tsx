import { Resources } from "@utils/enums";
import { EventBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name?: string;
  namespace?: string;
}

export const EventResourceLink = ({ name, namespace }: Props): JSX.Element => {
  if (!name) return <></>;
  
  return (
    <>
      <EventBadge />
      <ResourceLink resource={Resources.Events} name={name} namespace={namespace} />
    </>
  )
}