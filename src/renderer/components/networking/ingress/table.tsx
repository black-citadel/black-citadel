import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { getHosts, getPaths, getTLS } from '@utils/helpers';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { IngressResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';

interface Props {
  ingresses: k8s.V1IngressList
}

export const IngressList = ({ ingresses }: Props): JSX.Element => {
  const { activeNamespace } = useView();

  const headers = ['Name', 'Namespace', 'Hosts', 'Paths', 'TLS'];

  const filteredIngresses = activeNamespace === "all" 
  ? ingresses.items 
  : ingresses.items.filter(ingress => ingress.metadata.namespace === activeNamespace);

  const processedRows = filteredIngresses.map(ingress => ({
    Name: <IngressResourceLink name={ingress.metadata.name} namespace={ingress.metadata.namespace} />,
    Namespace: <NamespaceResourceLink name={ingress.metadata.namespace} />,
    Hosts: getHosts(ingress),
    Paths: getPaths(ingress),
    TLS: getTLS(ingress)
  }));

  return (
    <ListTable headers={headers} rows={processedRows} />
  )
}