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

export const JobsDetailsView = (): JSX.Element => {
  const { viewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [job, setJob] = useState<k8s.V1Job>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedJob(viewContext.name, viewContext.namespace);
      setJob(data);
      setError(null);
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
      <DetailsHeader error={error}><JobBadge />{viewContext.name}</DetailsHeader>

      <Navbar>
        <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
      </Navbar>

      {activeTab === ResourceTabs.Details && job && (
        <div className="grid grid-cols-2 gap-4">
          <div className='m-2'>
            <DetailsName name={job.metadata.name} />
            <DetailsNamespace name={job.metadata.namespace} />
            <DetailsLabels labels={job.metadata.labels} />
            <DetailsAnnotations annotations={job.metadata.annotations} />
          </div>

          <div className='m-2'>
            <DetailsItem label="Parallelism">
              {job.spec.parallelism}
            </DetailsItem>
            <DetailsItem label="Completions">
              {job.spec.completions}
            </DetailsItem>
            <DetailsItem label="Active Deadline Seconds">
              {job.spec.activeDeadlineSeconds}
            </DetailsItem>
            <DetailsItem label="Backoff Limit">
              {job.spec.backoffLimit}
            </DetailsItem>
            <DetailsItem label="Completion Mode">
              {job.spec.completionMode}
            </DetailsItem>
            <DetailsItem label="Suspend">
              {job.spec.suspend ? 'Yes' : 'No'}
            </DetailsItem>
            <PodTemplate template={job.spec.template} />
            <JobStatus status={job.status} />
          </div>
        </div>
      )}

      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};