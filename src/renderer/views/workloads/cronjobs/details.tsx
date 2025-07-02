import k8s = require('@kubernetes/client-node');
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsAnnotations, DetailsItem, DetailsLabels, DetailsName, DetailsNamespace } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { CronJobBadge } from '@components/workloads/cronjob/badge';
import { JobTemplate } from '@components/workloads/cronjob/job-template';
import { CronJobStatus } from '@components/workloads/cronjob/status';
import { MetadataDetails } from '@components/metadata';
import { Heading, Subheading } from '@components/base/heading';
import { JobList } from '@components/workloads/job/table';
import { WorkloadLogs } from '@components/workloads/workload-logs';
import { ResourceActions } from '@components/resources/ResourceActions';

export const CronJobsDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [cronJob, setCronJob] = useState<k8s.V1CronJob>();
  const [jobs, setJobs] = useState<k8s.V1JobList>();
  const [pods, setPods] = useState<k8s.V1PodList>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedCronJob(viewContext.name, viewContext.namespace);
      setCronJob(data);
      setError(null);

      // Fetch jobs created by this CronJob
      const jobsData = await window.electronAPI.listNamespacedJob(data.metadata.namespace);
      const filteredJobs = jobsData.items.filter(job => 
        job.metadata?.ownerReferences?.some(ref => 
          ref.kind === 'CronJob' && ref.name === data.metadata.name
        )
      );
      setJobs({ items: filteredJobs });

      // Fetch pods from active jobs
      if (filteredJobs.length > 0) {
        const podsData = await window.electronAPI.listNamespacedPod(data.metadata.namespace);
        const filteredPods = podsData.items.filter(pod => 
          pod.metadata?.ownerReferences?.some(ref => 
            ref.kind === 'Job' && filteredJobs.some(job => job.metadata.name === ref.name)
          )
        );
        setPods({ items: filteredPods });
      } else {
        setPods({ items: [] });
      }
    } catch (e) {
      console.error("Failed to fetch cron job:", e);
      setError("Failed to fetch cron job.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(cronJob);

  const handleDelete = async () => {
    await window.electronAPI.deleteNamespacedCronJob(viewContext.name, viewContext.namespace);
    setViewContext({ resource: Resources.CronJobs, action: ResourceAction.List });
  };

  return (
    <>
      <DetailsHeader 
        error={error}
        actions={
          <ResourceActions
            resourceType={Resources.CronJobs}
            resourceName={viewContext.name}
            namespace={viewContext.namespace}
            resource={cronJob}
            onDelete={handleDelete}
          />
        }
      >
        <Heading>
          <CronJobBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.Logs)} current={activeTab == ResourceTabs.Logs}>{ResourceTabs.Logs}</NavbarItem>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
          </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && cronJob && (
        <div className='m-2'>
          <MetadataDetails metadata={cronJob.metadata} />

          <Subheading className='mt-8 mb-4'>Spec</Subheading>
          <div>
            <DetailsItem label="Schedule">
              {cronJob.spec.schedule}
            </DetailsItem>
            <DetailsItem label="Suspend">
              {cronJob.spec.suspend ? 'Yes' : 'No'}
            </DetailsItem>
            <DetailsItem label="Concurrency Policy">
              {cronJob.spec.concurrencyPolicy || 'Allow'}
            </DetailsItem>
            <DetailsItem label="Starting Deadline Seconds">
              {cronJob.spec.startingDeadlineSeconds || 'Not set'}
            </DetailsItem>
            <DetailsItem label="Successful Jobs History Limit">
              {cronJob.spec.successfulJobsHistoryLimit || 3}
            </DetailsItem>
            <DetailsItem label="Failed Jobs History Limit">
              {cronJob.spec.failedJobsHistoryLimit || 1}
            </DetailsItem>
          </div>

          <Subheading className='mt-8'>Job Template</Subheading>
          <JobTemplate template={cronJob.spec.jobTemplate} />

          <Subheading className='mt-8'>Jobs</Subheading>
          {jobs && <JobList jobs={jobs} />}

          <CronJobStatus status={cronJob.status} />
        </div>
      )}

      {activeTab === ResourceTabs.Logs && cronJob && pods && (
        <div className='m-2'>
          {pods.items.length > 0 ? (
            <WorkloadLogs
              pods={pods.items || []}
              namespace={cronJob.metadata.namespace}
            />
          ) : (
            <div className="text-zinc-500 text-center py-8">
              No active pods found. Pods are created when the CronJob runs according to its schedule.
            </div>
          )}
        </div>
      )}

      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};