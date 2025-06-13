import k8s = require('@kubernetes/client-node');
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs } from "@utils/enums";
import { useEffect, useState } from "react";
import { MetadataDetails } from '@components/metadata';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { DaemonSetBadge } from '@components/workloads/daemonset/badge';
import { UpdateStrategy } from '@components/workloads/daemonset/update-strategy';
import { PodTemplate } from '@components/workloads/pod/template';
import { DaemonSetStatus } from '@components/workloads/daemonset/status';
import { DaemonSetSpec } from '@components/workloads/daemonset/spec';
import { PodList } from '@components/workloads/pod/table';
import { Heading, Subheading } from '@components/base/heading';
import { WorkloadLogs } from '@components/workload-logs';

export const DaemonSetsDetailsView = (): JSX.Element => {
  const { viewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [daemonSet, setDaemonSet] = useState<k8s.V1DaemonSet>();
  const [pods, setPods] = useState<k8s.V1PodList>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const [daemonSetData, podsData] = await Promise.all([
        window.electronAPI.readNamespacedDaemonSet(viewContext.name, viewContext.namespace),
        window.electronAPI.listNamespacedPod(viewContext.namespace)
      ]);
      setDaemonSet(daemonSetData);
      
      // Filter pods by daemonset selector
      if (daemonSetData.spec.selector?.matchLabels && podsData) {
        const filteredPods = podsData.items.filter(pod => {
          return Object.entries(daemonSetData.spec.selector.matchLabels).every(([key, value]) => 
            pod.metadata?.labels?.[key] === value
          );
        });
        setPods({ items: filteredPods });
      }
      
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
      <DetailsHeader error={error}>
        <Heading>
          <DaemonSetBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.Logs)} current={activeTab == ResourceTabs.Logs}>{ResourceTabs.Logs}</NavbarItem>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
          </NavbarSection>
        </Navbar>
      </DetailsHeader>


      {activeTab === ResourceTabs.Details && daemonSet && (
        <div className='m-2'>
          <MetadataDetails metadata={daemonSet.metadata} />

          <DaemonSetSpec spec={daemonSet.spec} />

          <Subheading className='mt-8'>Update Strategy</Subheading>
          <UpdateStrategy strategy={daemonSet.spec.updateStrategy} />

          <Subheading className='mt-8'>Pod Template</Subheading>
          <PodTemplate template={daemonSet.spec.template} />

          <Subheading className='mt-8'>Pods</Subheading>
          {pods && <PodList pods={pods} />}

          <DaemonSetStatus status={daemonSet.status} />
        </div>
      )}

      {activeTab === ResourceTabs.Logs && daemonSet && pods && (
        <div className='m-2'>
          <WorkloadLogs
            pods={pods.items || []}
            namespace={daemonSet.metadata.namespace}
          />
        </div>
      )}

      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>
  );
};