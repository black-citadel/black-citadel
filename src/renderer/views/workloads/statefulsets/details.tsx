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
import { PodList } from '@components/workloads/pod/table';
import { Heading } from '@components/base/heading';
import { WorkloadLogs } from '@components/workloads/workload-logs';
import { ResourceActions } from '@components/resources/ResourceActions';
import { Container } from '@components/base/container';
import { DetailsItem, DetailsSelector } from '@components/details-item';

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

  const handleEdit = () => {
    setViewContext({
      resource: Resources.StatefulSets,
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
            resourceType={Resources.StatefulSets}
            resourceName={viewContext.name}
            namespace={viewContext.namespace}
            resource={statefulSet}
            onDelete={handleDelete}
            onEdit={handleEdit}
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
          <Container title="Configuration">
            <div className="grid grid-cols-3 gap-4">
              <DetailsItem label="Replicas">
                {statefulSet.spec.replicas || 0}
              </DetailsItem>
              <DetailsItem label="Service Name">
                {statefulSet.spec.serviceName}
              </DetailsItem>
              <DetailsItem label="Pod Management Policy">
                {statefulSet.spec.podManagementPolicy || 'OrderedReady'}
              </DetailsItem>
              <DetailsItem label="Revision History Limit">
                {statefulSet.spec.revisionHistoryLimit || 10}
              </DetailsItem>
              <DetailsItem label="Min Ready Seconds">
                {statefulSet.spec.minReadySeconds || 0}
              </DetailsItem>
              <DetailsSelector labels={statefulSet.spec.selector?.matchLabels} />
            </div>
          </Container>

          <Container title="Status">
            <div className="grid grid-cols-3 gap-4">
              <DetailsItem label="Replicas">
                {statefulSet.status?.replicas || 0}
              </DetailsItem>
              <DetailsItem label="Ready Replicas">
                {statefulSet.status?.readyReplicas || 0}
              </DetailsItem>
              <DetailsItem label="Current Replicas">
                {statefulSet.status?.currentReplicas || 0}
              </DetailsItem>
              <DetailsItem label="Updated Replicas">
                {statefulSet.status?.updatedReplicas || 0}
              </DetailsItem>
              <DetailsItem label="Current Revision">
                {statefulSet.status?.currentRevision || 'N/A'}
              </DetailsItem>
              <DetailsItem label="Update Revision">
                {statefulSet.status?.updateRevision || 'N/A'}
              </DetailsItem>
            </div>
            {statefulSet.status?.conditions && statefulSet.status.conditions.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Conditions</h4>
                <div className="space-y-2">
                  {statefulSet.status.conditions.map((condition, index) => (
                    <div key={index} className="p-3 border rounded">
                      <div className="grid grid-cols-2 gap-2">
                        <div><span className="font-medium">Type:</span> {condition.type}</div>
                        <div><span className="font-medium">Status:</span> {condition.status}</div>
                        {condition.reason && <div><span className="font-medium">Reason:</span> {condition.reason}</div>}
                        {condition.message && <div className="col-span-2"><span className="font-medium">Message:</span> {condition.message}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Container>

          <Container title="Update Strategy">
            <UpdateStrategy strategy={statefulSet.spec.updateStrategy} />
          </Container>

          <Container title="Pod Template">
            <PodTemplate template={statefulSet.spec.template} />
          </Container>

          {statefulSet.spec.volumeClaimTemplates && statefulSet.spec.volumeClaimTemplates.length > 0 && (
            <Container title="Volume Claim Templates">
              <VolumeClaimTemplates templates={statefulSet.spec.volumeClaimTemplates} />
            </Container>
          )}

          <Container title='Pods'>
            {pods && <PodList pods={pods} />}
          </Container>

          <MetadataDetails metadata={statefulSet.metadata} />
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