import type { V1Volume } from '@kubernetes/client-node';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@protoku-bv/design-system';
import { Container } from '@components/base/container';
import { PanelListItem } from '@components/layout/panel';
import { ConfigMapResourceLink } from '@components/configuration/config-map/resource-link';
import { SecretResourceLink } from '@components/configuration/secret/resource-link';
import { PersistentVolumeClaimResourceLink } from '@components/storage/persistent-volume-claim/resource-link';
import { VolumeDetails } from '@components/gen/V1Volume/details';
import { useView } from '@context/viewProvider';

interface Props {
  volumes: V1Volume[];
}

interface VolumeSummary {
  type: string;
  source: React.ReactNode;
}

const optional = (flag?: boolean) => flag ? <span className="text-xs text-zinc-500"> (optional)</span> : null;

const summarize = (volume: V1Volume, namespace: string): VolumeSummary => {
  if (volume.configMap) {
    return {
      type: 'ConfigMap',
      source: <><ConfigMapResourceLink name={volume.configMap.name ?? ''} namespace={namespace} />{optional(volume.configMap.optional)}</>,
    };
  }
  if (volume.secret) {
    return {
      type: 'Secret',
      source: <><SecretResourceLink name={volume.secret.secretName ?? ''} namespace={namespace} />{optional(volume.secret.optional)}</>,
    };
  }
  if (volume.persistentVolumeClaim) {
    return {
      type: 'PersistentVolumeClaim',
      source: (
        <>
          <PersistentVolumeClaimResourceLink name={volume.persistentVolumeClaim.claimName} namespace={namespace} />
          {volume.persistentVolumeClaim.readOnly && <span className="text-xs text-zinc-500"> (read-only)</span>}
        </>
      ),
    };
  }
  if (volume.emptyDir) {
    const { medium, sizeLimit } = volume.emptyDir;
    return {
      type: 'EmptyDir',
      source: <span className="text-zinc-400">{medium ?? 'node storage'}{sizeLimit ? `, limit ${String(sizeLimit)}` : ''}</span>,
    };
  }
  if (volume.hostPath) {
    return {
      type: 'HostPath',
      source: <span className="font-mono text-xs">{volume.hostPath.path}{volume.hostPath.type ? ` (${volume.hostPath.type})` : ''}</span>,
    };
  }
  if (volume.projected) {
    const kinds = (volume.projected.sources ?? []).map((source) =>
      Object.entries(source).find(([, value]) => value !== undefined)?.[0] ?? 'unknown');
    return { type: 'Projected', source: <span className="text-zinc-400">{kinds.join(', ') || 'no sources'}</span> };
  }
  if (volume.downwardAPI) {
    const count = volume.downwardAPI.items?.length ?? 0;
    return { type: 'Downward API', source: <span className="text-zinc-400">{count} item{count === 1 ? '' : 's'}</span> };
  }
  if (volume.csi) {
    return { type: 'CSI', source: <span className="font-mono text-xs">{volume.csi.driver}</span> };
  }
  if (volume.nfs) {
    return { type: 'NFS', source: <span className="font-mono text-xs">{volume.nfs.server}:{volume.nfs.path}</span> };
  }
  if (volume.ephemeral) {
    const storageClass = volume.ephemeral.volumeClaimTemplate?.spec?.storageClassName;
    return { type: 'Ephemeral', source: <span className="text-zinc-400">{storageClass ? `storage class ${storageClass}` : 'volume claim template'}</span> };
  }
  const sourceKey = Object.entries(volume).find(([key, value]) => key !== 'name' && value !== undefined)?.[0];
  return { type: sourceKey ?? 'unknown', source: null };
};

export const VolumesTable = ({ volumes }: Props): JSX.Element => {
  const { viewContext } = useView();
  const namespace = viewContext.namespace ?? '';

  return (
    <>
      <Table dense>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Type</TableHeader>
            <TableHeader>Source</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {volumes.map((volume, index) => {
            const summary = summarize(volume, namespace);
            return (
              <TableRow key={`${volume.name}-${index}`}>
                <TableCell>{volume.name}</TableCell>
                <TableCell>{summary.type}</TableCell>
                <TableCell>{summary.source}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Container title="All fields" collapsible defaultOpen={false}>
        {volumes.map((volume, index) => (
          <PanelListItem key={`${volume.name}-${index}`} title={volume.name}>
            <VolumeDetails resourceData={volume} />
          </PanelListItem>
        ))}
      </Container>
    </>
  );
};
