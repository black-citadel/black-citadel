import k8s = require('@kubernetes/client-node');
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceAction, Resources, ResourceTabs } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsItem, } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { PodBadge } from '@components/workloads/pod/badge';
import { MetadataDetails } from '@components/metadata';
import { Heading, Subheading } from '@components/base/heading';
import { Description, Field, Label } from '@components/base/fieldset';
import { HelpButton } from '@components/help-button';
import helpObjects from '@help/index';
import { WorkloadLogs } from '@components/workload-logs';

export const PodsDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [pod, setPod] = useState<k8s.V1Pod>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedPod(viewContext.name, viewContext.namespace);
      setPod(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch pod:", e);
      setError("Failed to fetch pod.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(pod);

  const handleDelete = async () => {
    await window.electronAPI.deleteNamespacedPod(viewContext.name, viewContext.namespace);
    setViewContext({ resource: Resources.Pods, action: ResourceAction.List });
  };

  return (
    <>
      <DetailsHeader error={error} onDelete={handleDelete}>
        <Heading>
          <PodBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.Logs)} current={activeTab == ResourceTabs.Logs}>{ResourceTabs.Logs}</NavbarItem>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
          </NavbarSection>
        </Navbar>
      </DetailsHeader>



      {activeTab === ResourceTabs.Details && pod && (

        <div className='m-2'>
          <MetadataDetails metadata={pod.metadata} />

          <Subheading className='mt-8 mb-4'>Status</Subheading>

          <div>

            <Field className="grid gap-x-8 gap-y-6 grid-cols-2 my-8">
              <div className='px-4'>
                <Label>Phase <HelpButton title="Phase" content={helpObjects.pod.phase.help} /></Label>
                <Description>
                  The phase of a Pod is a simple, high-level summary of where the Pod is in its lifecycle.
                </Description>
              </div>
              <div className='px-4'>
                <span style={{ color: pod.status.phase === 'Running' ? 'green' : 'inherit' }}>
                  {pod.status.phase}
                </span>
              </div>
            </Field>
            <DetailsItem label="Pod IP">
              {pod.status.podIP}
            </DetailsItem>
            <DetailsItem label="Host IP">
              {pod.status.hostIP}
            </DetailsItem>
            <DetailsItem label="Start Time">
              {pod.status.startTime?.toLocaleString()}
            </DetailsItem>
          </div>

          <Subheading className='mt-8 mb-4'>Configuration</Subheading>

          <div>
            <DetailsItem label="Node">
              {pod.spec.nodeName}
            </DetailsItem>
            <DetailsItem label="Service Account">
              {pod.spec.serviceAccountName}
            </DetailsItem>
            <DetailsItem label="Restart Policy">
              {pod.spec.restartPolicy}
            </DetailsItem>
            <DetailsItem label="Node Selector">
              {Object.entries(pod.spec.nodeSelector || {}).map(([key, value]) => (
                <div key={key}>{key}: {value}</div>
              ))}
            </DetailsItem>
            <DetailsItem label="Tolerations">
              {pod.spec.tolerations?.map((toleration, index) => (
                <div key={index}>
                  {toleration.key}: {toleration.operator} {toleration.value}
                </div>
              ))}
            </DetailsItem>
          </div>


        </div>
      )}


      {activeTab === ResourceTabs.Logs && pod && (
        <div className='m-2'>
          <WorkloadLogs
            pods={[pod]}
            namespace={pod.metadata.namespace}
          />
        </div>
      )}

      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};
