import { Resources } from "@utils/enums";
import { PersistentVolumeClaimBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
  namespace: string;
}

export const PersistentVolumeClaimResourceLink = ({ name, namespace }: Props): JSX.Element => {
  return (
    <>
      <PersistentVolumeClaimBadge />
      <ResourceLink resource={Resources.PersistentVolumeClaims} name={name} namespace={namespace} />
    </>
  )
}