import {
  V1Job,
  V1PodList
} from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsItem, DetailsSelector } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { JobBadge } from '@components/workloads/job/badge';
import { PodTemplate } from '@components/workloads/pod/template';
import { MetadataDetails } from '@components/metadata';
import { Heading } from '@components/base/heading';
import { PodList } from '@components/workloads/pod/table';
import { WorkloadLogs } from '@components/workloads/workload-logs';
import { ResourceActions } from '@components/resources/ResourceActions';
import { Container } from '@components/base/container';

function getLabelSelectorString(selector: { [key: string]: string }): string {
  return Object.keys(selector)
    .map((key) => `${key}=${selector[key]}`)
    .join(',');
}

export const JobsDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [job, setJob] = useState<V1Job>();
  const [pods, setPods] = useState<V1PodList>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedJob(viewContext.name, viewContext.namespace);
      setJob(data);
      setError(null);

      // Fetch pods for this job
      const data2 = await window.electronAPI.listNamespacedPod(data.metadata.namespace, undefined, undefined, undefined, undefined, getLabelSelectorString(data.spec.selector.matchLabels || {}));
      setPods(data2);
    } catch (e) {
      console.error("Failed to fetch job:", e);
      setError("Failed to fetch job.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(job);

  const handleDelete = async () => {
    await window.electronAPI.deleteNamespacedJob(viewContext.name, viewContext.namespace);
    setViewContext({ resource: Resources.Jobs, action: ResourceAction.List });
  };

  const handleEdit = () => {
    setViewContext({
      resource: Resources.Jobs,
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
            resourceType={Resources.Jobs}
            resourceName={viewContext.name}
            namespace={viewContext.namespace}
            resource={job}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        }
      >
        <Heading>
          <JobBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.Logs)} current={activeTab == ResourceTabs.Logs}>{ResourceTabs.Logs}</NavbarItem>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
          </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && job && (
        <div className='m-2'>
          <Container title="Configuration">
            <div className="grid grid-cols-3 gap-4">
              <DetailsItem label="Parallelism">
                {job.spec.parallelism || 1}
              </DetailsItem>
              <DetailsItem label="Completions">
                {job.spec.completions || 1}
              </DetailsItem>
              <DetailsItem label="Backoff Limit">
                {job.spec.backoffLimit || 6}
              </DetailsItem>
              <DetailsItem label="Active Deadline Seconds">
                {job.spec.activeDeadlineSeconds || 'Not set'}
              </DetailsItem>
              <DetailsItem label="Completion Mode">
                {job.spec.completionMode || 'NonIndexed'}
              </DetailsItem>
              <DetailsItem label="Suspend">
                {job.spec.suspend ? 'Yes' : 'No'}
              </DetailsItem>
              <DetailsSelector labels={job.spec.selector?.matchLabels} />
            </div>
          </Container>

          <Container title="Status">
            <div className="grid grid-cols-3 gap-4">
              <DetailsItem label="Active">
                {job.status?.active || 0}
              </DetailsItem>
              <DetailsItem label="Succeeded">
                {job.status?.succeeded || 0}
              </DetailsItem>
              <DetailsItem label="Failed">
                {job.status?.failed || 0}
              </DetailsItem>
              <DetailsItem label="Start Time">
                {job.status?.startTime ? new Date(job.status.startTime).toLocaleString() : 'Not started'}
              </DetailsItem>
              <DetailsItem label="Completion Time">
                {job.status?.completionTime ? new Date(job.status.completionTime).toLocaleString() : 'Not completed'}
              </DetailsItem>
              <DetailsItem label="Duration">
                {job.status?.startTime && job.status?.completionTime
                  ? `${Math.round((new Date(job.status.completionTime).getTime() - new Date(job.status.startTime).getTime()) / 1000)}s`
                  : job.status?.startTime
                  ? `${Math.round((Date.now() - new Date(job.status.startTime).getTime()) / 1000)}s (running)`
                  : 'N/A'}
              </DetailsItem>
            </div>
            {job.status?.conditions && job.status.conditions.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Conditions</h4>
                <div className="space-y-2">
                  {job.status.conditions.map((condition, index) => (
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

          <Container title="Pod Template">
            <PodTemplate template={job.spec.template} />
          </Container>

          <Container title='Pods'>
            {pods && <PodList pods={pods} />}
          </Container>

          <MetadataDetails metadata={job.metadata} />
        </div>
      )}

      {activeTab === ResourceTabs.Logs && job && pods && (
        <div className='m-2'>
          <WorkloadLogs
            pods={pods.items || []}
            namespace={job.metadata.namespace}
          />
        </div>
      )}

      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>
  );
};