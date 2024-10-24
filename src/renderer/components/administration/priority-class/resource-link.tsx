import { Resources } from "@utils/enums";
import { PriorityClassBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
}

export const PriorityClassResourceLink = ({ name }: Props): JSX.Element => {
  return (
    <>
      <PriorityClassBadge />
      <ResourceLink resource={Resources.PriorityClasses} name={name} />
    </>
  )
}