import k8s = require('@kubernetes/client-node');
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsAnnotations, DetailsItem, DetailsLabels, DetailsName, DetailsNamespace } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { CronJobBadge } from '@components/workloads/cronjob/badge';
import { JobTemplate } from '@components/workloads/cronjob/job-template';
import { CronJobStatus } from '@components/workloads/cronjob/status';

export const CronJobsDetailsView = (): JSX.Element => {
  const { viewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [cronJob, setCronJob] = useState<k8s.V1CronJob>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedCronJob(viewContext.name, viewContext.namespace);
      setCronJob(data);
      setError(null);
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

  return (
    <>
      <DetailsHeader error={error}><CronJobBadge />{viewContext.name}</DetailsHeader>

      <Navbar>
        <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
      </Navbar>

      {activeTab === ResourceTabs.Details && cronJob && (
        <div className="grid grid-cols-2 gap-4">
          <div className='m-2'>
            <DetailsName name={cronJob.metadata.name} />
            <DetailsNamespace name={cronJob.metadata.namespace} />
            <DetailsLabels labels={cronJob.metadata.labels} />
            <DetailsAnnotations annotations={cronJob.metadata.annotations} />
          </div>

          <div className='m-2'>
            <DetailsItem label="Schedule">
              {cronJob.spec.schedule}
            </DetailsItem>
            <DetailsItem label="Suspend">
              {cronJob.spec.suspend ? 'Yes' : 'No'}
            </DetailsItem>
            <DetailsItem label="Concurrency Policy">
              {cronJob.spec.concurrencyPolicy}
            </DetailsItem>
            <DetailsItem label="Starting Deadline Seconds">
              {cronJob.spec.startingDeadlineSeconds}
            </DetailsItem>
            <DetailsItem label="Successful Jobs History Limit">
              {cronJob.spec.successfulJobsHistoryLimit}
            </DetailsItem>
            <DetailsItem label="Failed Jobs History Limit">
              {cronJob.spec.failedJobsHistoryLimit}
            </DetailsItem>
            <JobTemplate template={cronJob.spec.jobTemplate} />
            <CronJobStatus status={cronJob.status} />
          </div>
        </div>
      )}

      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};