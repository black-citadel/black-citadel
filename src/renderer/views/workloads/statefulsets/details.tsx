import {
  V1PodList,
  V1StatefulSet
} from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { useEffect, useState } from "react";
import { MetadataDetails } from '@components/metadata';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { StatefulSetBadge } from '@components/workloads/statefulset/badge';
import { PodTemplate } from '@components/workloads/pod/template';
import { UpdateStrategy } from '@components/workloads/statefulset/update-strategy';
import { VolumeClaimTemplates } from '@components/workloads/statefulset/volume-claim-templates';
import { StatefulSetStatus } from '@components/workloads/statefulset/status';
import { StatefulSetSpec } from '@components/workloads/statefulset/spec';
import { PodList } from '@components/workloads/pod/table';
import { Heading, Subheading } from '@components/base/heading';
import { WorkloadLogs } from '@components/workloads/workload-logs';
import { ResourceActions } from '@components/resources/ResourceActions';
import { Container } from '@components/base/container';

export const StatefulSetsDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [statefulSet, setStatefulSet] = useState<V1StatefulSet>();
  const [pods, setPods] = useState<V1PodList>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const [statefulSetData, podsData] = await Promise.all([
        window.electronAPI.readNamespacedStatefulSet(viewContext.name, viewContext.namespace),
        window.electronAPI.listNamespacedPod(viewContext.namespace)
      ]);
      setStatefulSet(statefulSetData);
      
      // Filter pods by statefulset selector
      if (statefulSetData.spec.selector?.matchLabels && podsData) {
        const filteredPods = podsData.items.filter(pod => {
          return Object.entries(statefulSetData.spec.selector.matchLabels).every(([key, value]) => 
            pod.metadata?.labels?.[key] === value
          );
        });
        setPods({ items: filteredPods });
      }
      
      setError(null);
    } catch (e) {
      console.error("Failed to fetch stateful set:", e);
      setError("Failed to fetch stateful set.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(statefulSet);

  const handleDelete = async () => {
    await window.electronAPI.deleteNamespacedStatefulSet(viewContext.name, viewContext.namespace);
    setViewContext({ resource: Resources.StatefulSets, action: ResourceAction.List });
  };

  return (
    <>
      <DetailsHeader 
        error={error}
        actions={
          <ResourceActions
            resourceType={Resources.StatefulSets}
            resourceName={viewContext.name}
            namespace={viewContext.namespace}
            resource={statefulSet}
            onDelete={handleDelete}
          />
        }
      >
        <Heading>
          <StatefulSetBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.Logs)} current={activeTab == ResourceTabs.Logs}>{ResourceTabs.Logs}</NavbarItem>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
          </NavbarSection>
        </Navbar>
      </DetailsHeader>


      {activeTab === ResourceTabs.Details && statefulSet && (
        <div className='m-2'>
          <MetadataDetails metadata={statefulSet.metadata} />

          <StatefulSetSpec spec={statefulSet.spec} />

          <Subheading className='mt-8'>Update Strategy</Subheading>
          <UpdateStrategy strategy={statefulSet.spec.updateStrategy} />

          <Subheading className='mt-8'>Pod Template</Subheading>
          <PodTemplate template={statefulSet.spec.template} />

          {statefulSet.spec.volumeClaimTemplates && statefulSet.spec.volumeClaimTemplates.length > 0 && (
            <>
              <Subheading className='mt-8'>Volume Claim Templates</Subheading>
              <VolumeClaimTemplates templates={statefulSet.spec.volumeClaimTemplates} />
            </>
          )}

          <Container title='Pods'>
            {pods && <PodList pods={pods} />}
          </Container>

          <StatefulSetStatus status={statefulSet.status} />
        </div>
      )}

      {activeTab === ResourceTabs.Logs && statefulSet && pods && (
        <div className='m-2'>
          <WorkloadLogs
            pods={pods.items || []}
            namespace={statefulSet.metadata.namespace}
          />
        </div>
      )}

      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>
  );
};