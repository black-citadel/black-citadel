import { Resources } from "@utils/enums";
import { ContextBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
}

export const ContextResourceLink = ({ name }: Props): JSX.Element => {
  return (
    <>
      <ContextBadge />
      <ResourceLink resource={Resources.Contexts} name={name} />
    </>
  )
}