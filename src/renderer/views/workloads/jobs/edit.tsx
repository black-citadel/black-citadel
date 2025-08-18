import { useState, useEffect } from 'react';
import { useView } from '@context/viewProvider'
import { JobBadge } from '@components/workloads/job/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { V1Job } from '@utils/k8s-types';
import { JobForm } from './_form';

export const JobsEditView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [job, setJob] = useState<V1Job | null>(null);
  const [payload, setPayload] = useState<any>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await window.electronAPI.readNamespacedJob(viewContext.name, viewContext.namespace);
        setJob(data);
      } catch (e) {
        console.error("Failed to fetch job:", e);
        setError("Failed to fetch job.");
      }
    };

    if (viewContext.name && viewContext.namespace) {
      fetchJob();
    }
  }, [viewContext.name, viewContext.namespace]);

  const handleUpdate = async () => {
    if (!payload || !job) return;
    try {
      // For jobs, we can only update metadata (labels and annotations)
      // Most job spec fields are immutable after creation
      const patchPayload = {
        metadata: {
          labels: payload.metadata?.labels || {},
          annotations: payload.metadata?.annotations || {}
        }
      };
      
      // Use patch to update only the metadata
      await window.electronAPI.patchNamespacedJob(
        viewContext.name, 
        viewContext.namespace, 
        patchPayload
      );

      // If we reach here, the update was successful
      setViewContext({
        resource: Resources.Jobs,
        action: ResourceAction.Details,
        name: viewContext.name,
        namespace: viewContext.namespace
      })
    } catch (e) {
      console.log(e);
      setError("Failed to update job. Note: Most job specifications are immutable after creation.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.Jobs,
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
        <JobBadge />Edit Job: {viewContext.name}
      </CreateHeader>

      {job && (
        <JobForm 
          job={job}
          onChange={setPayload}
          isEdit={true}
        />
      )}
    </>
  );
};