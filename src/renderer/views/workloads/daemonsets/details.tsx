import {
  V1DaemonSet,
  V1PodList
} from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { useEffect, useState } from "react";
import { MetadataDetails } from '@components/metadata';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { DaemonSetBadge } from '@components/workloads/daemonset/badge';
import { UpdateStrategy } from '@components/workloads/daemonset/update-strategy';
import { PodTemplate } from '@components/workloads/pod/template';
import { PodList } from '@components/workloads/pod/table';
import { Heading } from '@components/base/heading';
import { WorkloadLogs } from '@components/workloads/workload-logs';
import { ResourceActions } from '@components/resources/ResourceActions';
import { Container } from '@components/base/container';
import { DetailsItem, DetailsSelector } from '@components/details-item';

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
        <div className='m-2'>
          <Container title="Configuration">
            <div className="grid grid-cols-3 gap-4">
              <DetailsItem label="Min Ready Seconds">
                {daemonSet.spec.minReadySeconds || 0}
              </DetailsItem>
              <DetailsItem label="Revision History Limit">
                {daemonSet.spec.revisionHistoryLimit || 10}
              </DetailsItem>
              <DetailsSelector labels={daemonSet.spec.selector?.matchLabels} />
            </div>
          </Container>

          <Container title="Status">
            <div className="grid grid-cols-3 gap-4">
              <DetailsItem label="Current Number Scheduled">
                {daemonSet.status?.currentNumberScheduled || 0}
              </DetailsItem>
              <DetailsItem label="Desired Number Scheduled">
                {daemonSet.status?.desiredNumberScheduled || 0}
              </DetailsItem>
              <DetailsItem label="Number Ready">
                {daemonSet.status?.numberReady || 0}
              </DetailsItem>
              <DetailsItem label="Updated Number Scheduled">
                {daemonSet.status?.updatedNumberScheduled || 0}
              </DetailsItem>
              <DetailsItem label="Number Available">
                {daemonSet.status?.numberAvailable || 0}
              </DetailsItem>
              <DetailsItem label="Number Misscheduled">
                {daemonSet.status?.numberMisscheduled || 0}
              </DetailsItem>
            </div>
            {daemonSet.status?.conditions && daemonSet.status.conditions.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Conditions</h4>
                <div className="space-y-2">
                  {daemonSet.status.conditions.map((condition, index) => (
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
            <UpdateStrategy strategy={daemonSet.spec.updateStrategy} />
          </Container>

          <Container title="Pod Template">
            <PodTemplate template={daemonSet.spec.template} />
          </Container>

          <Container title='Pods'>
            {pods && <PodList pods={pods} />}
          </Container>

          <MetadataDetails metadata={daemonSet.metadata} />
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