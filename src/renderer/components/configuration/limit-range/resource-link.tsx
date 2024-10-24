import { Resources } from "@utils/enums";
import { LimitRangeBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
  namespace: string;
}

export const LimitRangeResourceLink = ({ name, namespace }: Props): JSX.Element => {
  return (
    <>
      <LimitRangeBadge />
      <ResourceLink resource={Resources.LimitRanges} name={name} namespace={namespace} />
    </>
  )
}