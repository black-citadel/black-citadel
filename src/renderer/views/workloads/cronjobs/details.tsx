import {
  V1CronJob,
  V1Job,
  V1JobList,
  V1Pod,
  V1PodList,
  V1OwnerReference
} from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsItem } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { CronJobBadge } from '@components/workloads/cronjob/badge';
import { JobTemplate } from '@components/workloads/cronjob/job-template';
import { MetadataDetails } from '@components/metadata';
import { Heading } from '@components/base/heading';
import { JobList } from '@components/workloads/job/table';
import { WorkloadLogs } from '@components/workloads/workload-logs';
import { ResourceActions } from '@components/resources/ResourceActions';
import { Container } from '@components/base/container';

export const CronJobsDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [cronJob, setCronJob] = useState<V1CronJob>();
  const [jobs, setJobs] = useState<V1JobList>();
  const [pods, setPods] = useState<V1PodList>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedCronJob(viewContext.name, viewContext.namespace);
      setCronJob(data);
      setError(null);

      // Fetch jobs created by this CronJob
      const jobsData = await window.electronAPI.listNamespacedJob(data.metadata.namespace);
      const filteredJobs = jobsData.items.filter((job: V1Job) => 
        job.metadata?.ownerReferences?.some((ref: V1OwnerReference) => 
          ref.kind === 'CronJob' && ref.name === data.metadata.name
        )
      );
      setJobs({ items: filteredJobs });

      // Fetch pods from active jobs
      if (filteredJobs.length > 0) {
        const podsData = await window.electronAPI.listNamespacedPod(data.metadata.namespace);
        const filteredPods = podsData.items.filter((pod: V1Pod) => 
          pod.metadata?.ownerReferences?.some((ref: V1OwnerReference) => 
            ref.kind === 'Job' && filteredJobs.some((job: V1Job) => job.metadata.name === ref.name)
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
          <Container title="Configuration">
            <div className="grid grid-cols-3 gap-4">
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
          </Container>

          <Container title="Status">
            <div className="grid grid-cols-3 gap-4">
              <DetailsItem label="Active Jobs">
                {cronJob.status?.active?.length || 0}
              </DetailsItem>
              <DetailsItem label="Last Schedule Time">
                {cronJob.status?.lastScheduleTime ? new Date(cronJob.status.lastScheduleTime).toLocaleString() : 'Never'}
              </DetailsItem>
              <DetailsItem label="Last Successful Time">
                {cronJob.status?.lastSuccessfulTime ? new Date(cronJob.status.lastSuccessfulTime).toLocaleString() : 'Never'}
              </DetailsItem>
            </div>
            {cronJob.status?.active && cronJob.status.active.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Active Jobs</h4>
                <div className="space-y-1">
                  {cronJob.status.active.map((jobRef, index) => (
                    <div key={index} className="text-sm">
                      {jobRef.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Container>

          <Container title="Job Template">
            <JobTemplate template={cronJob.spec.jobTemplate} />
          </Container>

          <Container title='Job History'>
            {jobs && jobs.items.length > 0 ? (
              <JobList jobs={jobs} />
            ) : (
              <div className="text-zinc-500 text-center py-4">
                No jobs created yet
              </div>
            )}
          </Container>

          <MetadataDetails metadata={cronJob.metadata} />
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

      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>
  );
};