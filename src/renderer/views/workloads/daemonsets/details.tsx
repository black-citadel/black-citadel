import k8s = require('@kubernetes/client-node');
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsAnnotations, DetailsItem, DetailsLabels, DetailsName, DetailsNamespace } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { DaemonSetBadge } from '@components/workloads/daemonset/badge';
import { UpdateStrategy } from '@components/workloads/daemonset/update-strategy';
import { PodTemplate } from '@components/workloads/pod/template';
import { DaemonSetStatus } from '@components/workloads/daemonset/status';

export const DaemonSetsDetailsView = (): JSX.Element => {
  const { viewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [daemonSet, setDaemonSet] = useState<k8s.V1DaemonSet>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedDaemonSet(viewContext.name, viewContext.namespace);
      setDaemonSet(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch daemon set:", e);
      setError("Failed to fetch daemon set.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(daemonSet);

  return (
    <>
      <DetailsHeader error={error}><DaemonSetBadge />{viewContext.name}</DetailsHeader>

      <Navbar>
        <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
      </Navbar>

      {activeTab === ResourceTabs.Details && daemonSet && (
        <div className="grid grid-cols-2 gap-4">
          <div className='m-2'>
            <DetailsName name={daemonSet.metadata.name} />
            <DetailsNamespace name={daemonSet.metadata.namespace} />
            <DetailsLabels labels={daemonSet.metadata.labels} />
            <DetailsAnnotations annotations={daemonSet.metadata.annotations} />
          </div>

          <div className='m-2'>
            <DetailsItem label="Selector">
              {Object.entries(daemonSet.spec.selector.matchLabels || {}).map(([key, value]) => (
                <div key={key}>{key}: {value}</div>
              ))}
            </DetailsItem>
            <UpdateStrategy strategy={daemonSet.spec.updateStrategy} />
            <DetailsItem label="Min Ready Seconds">
              {daemonSet.spec.minReadySeconds}
            </DetailsItem>
            <DetailsItem label="Revision History Limit">
              {daemonSet.spec.revisionHistoryLimit}
            </DetailsItem>
            <PodTemplate template={daemonSet.spec.template} />
            <DaemonSetStatus status={daemonSet.status} />
          </div>
        </div>
      )}

      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};