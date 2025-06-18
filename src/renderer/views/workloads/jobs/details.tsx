import k8s = require('@kubernetes/client-node');
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsAnnotations, DetailsItem, DetailsLabels, DetailsName, DetailsNamespace } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { JobBadge } from '@components/workloads/job/badge';
import { PodTemplate } from '@components/workloads/pod/template';
import { JobStatus } from '@components/workloads/job/status';
import { MetadataDetails } from '@components/metadata';
import { Heading, Subheading } from '@components/base/heading';
import { PodList } from '@components/workloads/pod/table';
import { WorkloadLogs } from '@components/workloads/workload-logs';

function getLabelSelectorString(selector: { [key: string]: string }): string {
  return Object.keys(selector)
    .map((key) => `${key}=${selector[key]}`)
    .join(',');
}

export const JobsDetailsView = (): JSX.Element => {
  const { viewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [job, setJob] = useState<k8s.V1Job>();
  const [pods, setPods] = useState<k8s.V1PodList>();
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

  return (
    <>
      <DetailsHeader error={error}>
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
          <MetadataDetails metadata={job.metadata} />

          <Subheading className='mt-8 mb-4'>Spec</Subheading>
          <div>
            <DetailsItem label="Parallelism">
              {job.spec.parallelism || 1}
            </DetailsItem>
            <DetailsItem label="Completions">
              {job.spec.completions || 1}
            </DetailsItem>
            <DetailsItem label="Active Deadline Seconds">
              {job.spec.activeDeadlineSeconds || 'Not set'}
            </DetailsItem>
            <DetailsItem label="Backoff Limit">
              {job.spec.backoffLimit || 6}
            </DetailsItem>
            <DetailsItem label="Completion Mode">
              {job.spec.completionMode || 'NonIndexed'}
            </DetailsItem>
            <DetailsItem label="Suspend">
              {job.spec.suspend ? 'Yes' : 'No'}
            </DetailsItem>
          </div>

          <Subheading className='mt-8'>Pod Template</Subheading>
          <PodTemplate template={job.spec.template} />

          <Subheading className='mt-8'>Pods</Subheading>
          {pods && <PodList pods={pods} />}

          <JobStatus status={job.status} />
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

      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};