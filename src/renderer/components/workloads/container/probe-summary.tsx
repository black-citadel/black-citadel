import type { V1Probe } from '@kubernetes/client-node';
import { PanelGrid } from '@components/layout/panel';

interface Props {
  probe: V1Probe;
  title?: string;
}

// Kubernetes applies these when the field is unset, so the summary shows what actually runs.
const DEFAULTS = { initialDelaySeconds: 0, periodSeconds: 10, timeoutSeconds: 1, successThreshold: 1, failureThreshold: 3 };

const describeHandler = (probe: V1Probe): React.ReactNode => {
  if (probe.httpGet) {
    const { path, port, scheme, host, httpHeaders } = probe.httpGet;
    return (
      <>
        <span className="font-medium">{scheme === 'HTTPS' ? 'HTTPS' : 'HTTP'} GET</span>{' '}
        <span className="font-mono text-xs">{path ?? '/'}</span>
        <span className="text-zinc-500"> on {host ? `${host}:` : 'port '}</span>
        <span className="font-mono text-xs">{String(port)}</span>
        {httpHeaders && httpHeaders.length > 0 && (
          <span className="text-zinc-500"> with {httpHeaders.length} header{httpHeaders.length === 1 ? '' : 's'}</span>
        )}
      </>
    );
  }
  if (probe.tcpSocket) {
    const { host, port } = probe.tcpSocket;
    return (
      <>
        <span className="font-medium">TCP</span>{' '}
        <span className="font-mono text-xs">{host ? `${host}:` : 'port '}{String(port)}</span>
      </>
    );
  }
  if (probe.grpc) {
    return (
      <>
        <span className="font-medium">gRPC</span>{' '}
        <span className="font-mono text-xs">port {probe.grpc.port}{probe.grpc.service ? ` service ${probe.grpc.service}` : ''}</span>
      </>
    );
  }
  if (probe.exec?.command) {
    return (
      <>
        <span className="font-medium">exec</span>{' '}
        <span className="font-mono text-xs break-all">{probe.exec.command.join(' ')}</span>
      </>
    );
  }
  return <span className="text-zinc-500">no handler</span>;
};

export const ProbeSummary = ({ probe, title = 'Probe' }: Props): JSX.Element => {
  const timing = [
    `every ${probe.periodSeconds ?? DEFAULTS.periodSeconds}s`,
    `timeout ${probe.timeoutSeconds ?? DEFAULTS.timeoutSeconds}s`,
    `initial delay ${probe.initialDelaySeconds ?? DEFAULTS.initialDelaySeconds}s`,
    `fails after ${probe.failureThreshold ?? DEFAULTS.failureThreshold}`,
    `succeeds after ${probe.successThreshold ?? DEFAULTS.successThreshold}`,
  ];
  if (probe.terminationGracePeriodSeconds !== undefined) {
    timing.push(`termination grace ${probe.terminationGracePeriodSeconds}s`);
  }

  return (
    <PanelGrid
      items={[{
        label: title,
        value: (
          <div>
            <div>{describeHandler(probe)}</div>
            <div className="text-xs text-zinc-500">{timing.join(' · ')}</div>
          </div>
        ),
      }]}
    />
  );
};
