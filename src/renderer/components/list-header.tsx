import { Heading } from "./base/heading"
import { ResourceAction, Resources } from "@utils/enums";
import { ResourceHelp } from "@utils/help";
import { NamespaceDropdown } from "./namespace-dropdown";
import { Button } from "./base/button";
import { useView } from '@context/viewProvider';

interface ListHeaderProps {
  resource: Resources
  error: string | null
}

const nonNamespacedResources: Resources[] = [
  Resources.Contexts,
  Resources.IngressClasses,
  Resources.PersistentVolumes,
  Resources.VolumeAttachments,
  Resources.StorageClasses,
  Resources.CSIDrivers,
  Resources.CSINodes,
  Resources.ClusterRoles,
  Resources.ClusterRoleBindings,
  Resources.Namespaces,
  Resources.PriorityClasses,
  Resources.RuntimeClasses,
  Resources.MutatingWebhookConfigurations,
  Resources.ValidatingWebhookConfigurations
];

export const ListHeader = ({ resource, error }: ListHeaderProps): JSX.Element => {
  const isNamespaced = !nonNamespacedResources.includes(resource);
  const { setViewContext } = useView();

  return (
    <div className="border-b border-zinc-950/10 pb-3 dark:border-white/10">
      {error && (
        <div className="border border-red-700 text-red-700 px-2 py-1.5 rounded relative mb-4" role="alert">
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div className="flex w-full flex-wrap items-end justify-between gap-4">
        <Heading>{resource}</Heading>
        <div className="flex gap-4">
          <Button onClick={() => setViewContext({ resource, action: ResourceAction.Create })} className="uppercase" outline>Create</Button>
          {isNamespaced && <NamespaceDropdown />}
        </div>
      </div>

      <div className="text-zinc-500 py-3 text-sm max-w-4xl">
        <span className="block sm:inline">{ResourceHelp[resource]}</span>
      </div>
    </div>
  )
}