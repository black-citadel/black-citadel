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
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { CronJobBadge } from '@components/workloads/cronjob/badge';
import { Heading } from '@components/base/heading';
import { JobList } from '@components/workloads/job/table';
import { WorkloadLogs } from '@components/workloads/workload-logs';
import { ResourceActions } from '@components/resources/ResourceActions';
import { Container } from '@components/base/container';
import { CronJobDetails } from '@components/gen/V1CronJob/details';

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

  const handleEdit = () => {
    setViewContext({
      resource: Resources.CronJobs,
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
            resourceType={Resources.CronJobs}
            resourceName={viewContext.name}
            namespace={viewContext.namespace}
            resource={cronJob}
            onDelete={handleDelete}
            onEdit={handleEdit}
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
        <>
          <CronJobDetails resourceData={cronJob} />

          <Container title='Job History'>
            {jobs && jobs.items.length > 0 ? (
              <JobList jobs={jobs} />
            ) : (
              <div className="text-zinc-500 text-center py-4">
                No jobs created yet
              </div>
            )}
          </Container>
        </>
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