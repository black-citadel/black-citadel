import {
  V1PodList,
  V1ReplicaSet
} from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { useEffect, useState } from "react";
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { ReplicaSetBadge } from '@components/workloads/replicaset/badge';
import { PodTemplate } from '@components/workloads/pod/template';
import { ReplicaSetStatus } from '@components/workloads/replicaset/status';
import { ReplicaSetSpec } from '@components/workloads/replicaset/spec';
import { Heading, Subheading } from '@components/base/heading';
import { MetadataDetails } from '@components/metadata';
import { PodList } from '@components/workloads/pod/table';
import { WorkloadLogs } from '@components/workloads/workload-logs';
import { ResourceActions } from '@components/resources/ResourceActions';
import { Container } from '@components/base/container';

function getLabelSelectorString(selector: { [key: string]: string }): string {
  return Object.keys(selector)
    .map((key) => `${key}=${selector[key]}`)
    .join(',');
}

export const ReplicaSetsDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [replicaSet, setReplicaSet] = useState<V1ReplicaSet>();
  const [pods, setPods] = useState<V1PodList>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedReplicaSet(viewContext.name, viewContext.namespace);
      setReplicaSet(data);
      setError(null);

      const data2 = await window.electronAPI.listNamespacedPod(data.metadata.namespace, undefined, undefined, undefined, undefined, getLabelSelectorString(data.spec.selector.matchLabels));
      setPods(data2);
    } catch (e) {
      console.error("Failed to fetch replica set:", e);
      setError("Failed to fetch replica set.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(replicaSet);

  const handleDelete = async () => {
    await window.electronAPI.deleteNamespacedReplicaSet(viewContext.name, viewContext.namespace);
    setViewContext({ resource: Resources.ReplicaSets, action: ResourceAction.List });
  };

  return (
    <>
      <DetailsHeader 
        error={error}
        actions={
          <ResourceActions
            resourceType={Resources.ReplicaSets}
            resourceName={viewContext.name}
            namespace={viewContext.namespace}
            resource={replicaSet}
            onDelete={handleDelete}
          />
        }
      >
        <Heading>
          <ReplicaSetBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.Logs)} current={activeTab == ResourceTabs.Logs}>{ResourceTabs.Logs}</NavbarItem>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
          </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && replicaSet && (
        <div className='m-2'>
          <MetadataDetails metadata={replicaSet.metadata} />

          <ReplicaSetSpec spec={replicaSet.spec} />

          <Subheading className='mt-8'>Pod Template</Subheading>
          <PodTemplate template={replicaSet.spec.template} />

          <Container title='Pods'>
            {pods && <PodList pods={pods} />}
          </Container>

          <ReplicaSetStatus status={replicaSet.status} />
        </div>
      )}

      {activeTab === ResourceTabs.Logs && replicaSet && pods && (
        <div className='m-2'>
          <WorkloadLogs
            pods={pods.items || []}
            namespace={replicaSet.metadata.namespace}
          />
        </div>
      )}

      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};