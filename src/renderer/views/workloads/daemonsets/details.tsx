import {
  V1DaemonSet,
  V1PodList
} from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { useEffect, useState } from "react";
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { DaemonSetBadge } from '@components/workloads/daemonset/badge';
import { PodList } from '@components/workloads/pod/table';
import { Heading } from '@components/base/heading';
import { WorkloadLogs } from '@components/workloads/workload-logs';
import { ResourceActions } from '@components/resources/ResourceActions';
import { Container } from '@components/base/container';
import { DaemonSetDetails } from '@components/gen/V1DaemonSet/details';

export const DaemonSetsDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [daemonSet, setDaemonSet] = useState<V1DaemonSet>();
  const [pods, setPods] = useState<V1PodList>();
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

  const handleDelete = async () => {
    await window.electronAPI.deleteNamespacedDaemonSet(viewContext.name, viewContext.namespace);
    setViewContext({ resource: Resources.DaemonSets, action: ResourceAction.List });
  };

  const handleEdit = () => {
    setViewContext({
      resource: Resources.DaemonSets,
      action: ResourceAction.Edit,
      name: viewContext.name,
      namespace: viewContext.namespace
    });
  };

  return (
    <>
      <DetailsHeader 
        error={error}
        actions={
          <ResourceActions
            resourceType={Resources.DaemonSets}
            resourceName={viewContext.name}
            namespace={viewContext.namespace}
            resource={daemonSet}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        }
      >
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
        <>
          <DaemonSetDetails resourceData={daemonSet} />

          <Container title='Pods'>
            {pods && <PodList pods={pods} />}
          </Container>
        </>
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