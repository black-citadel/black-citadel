import { useState, useEffect } from 'react';
import { useView } from '@context/viewProvider'
import { CronJobBadge } from '@components/workloads/cronjob/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku-bv/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { V1CronJob } from '@utils/k8s-types';
import { dump } from 'js-yaml';
import { CronJobForm } from './_form';

export const CronJobsEditView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [cronJob, setCronJob] = useState<V1CronJob | null>(null);
  const [payload, setPayload] = useState<any>(null);

  useEffect(() => {
    const fetchCronJob = async () => {
      try {
        const data = await window.electronAPI.readNamespacedCronJob(viewContext.name, viewContext.namespace);
        setCronJob(data);
        setPayload(data); // Initialize payload with fetched data
      } catch (e) {
        console.error("Failed to fetch cron job:", e);
        setError("Failed to fetch cron job.");
      }
    };

    if (viewContext.name && viewContext.namespace) {
      fetchCronJob();
    }
  }, [viewContext.name, viewContext.namespace]);

  const handleUpdate = async () => {
    if (!payload || !cronJob) return;
    try {
      // Build a clean update payload with only the necessary fields
      const updatedCronJob = {
        apiVersion: 'batch/v1',
        kind: 'CronJob',
        metadata: {
          name: cronJob.metadata?.name,
          namespace: cronJob.metadata?.namespace,
          labels: payload.metadata?.labels,
          annotations: payload.metadata?.annotations,
        },
        spec: {
          schedule: payload.spec?.schedule,
          concurrencyPolicy: payload.spec?.concurrencyPolicy,
          successfulJobsHistoryLimit: payload.spec?.successfulJobsHistoryLimit,
          failedJobsHistoryLimit: payload.spec?.failedJobsHistoryLimit,
          jobTemplate: {
            spec: {
              template: payload.spec?.jobTemplate?.spec?.template
            }
          }
        }
      };
      
      // Apply the updated cron job
      const result = await window.electronAPI.apply(dump(updatedCronJob));

      if (result.success) {
        setViewContext({
          resource: Resources.CronJobs,
          action: ResourceAction.Details,
          name: viewContext.name,
          namespace: viewContext.namespace
        })
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to update cron job.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.CronJobs,
      action: ResourceAction.Details,
      name: viewContext.name,
      namespace: viewContext.namespace
    });
  };

  return (
    <>
      <CreateHeader 
        error={error}
        actions={
          <>
            <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
            <Button variant="primary" onClick={handleUpdate}>Update</Button>
          </>
        }
      >
        <CronJobBadge />Edit CronJob: {viewContext.name}
      </CreateHeader>

      {cronJob && (
        <CronJobForm 
          cronJob={cronJob}
          onChange={setPayload}
          isEdit={true}
        />
      )}
    </>
  );
};