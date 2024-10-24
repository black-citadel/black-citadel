import { Resources } from "@utils/enums";
import { PodDisruptionBudgetBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
  namespace: string;
}

export const PodDisruptionBudgetResourceLink = ({ name, namespace }: Props): JSX.Element => {
  return (
    <>
      <PodDisruptionBudgetBadge />
      <ResourceLink resource={Resources.PodDisruptionBudgets} name={name} namespace={namespace} />
    </>
  )
}