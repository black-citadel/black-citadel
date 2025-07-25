import { useState, useEffect } from 'react';
import { useView } from '@context/viewProvider'
import { NamespaceBadge } from '@components/cluster/namespace/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { V1Namespace } from '@utils/k8s-types';
import { dump } from 'js-yaml';
import { NamespaceForm } from './_form';


export const NamespacesEditView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [namespace, setNamespace] = useState<V1Namespace | null>(null);
  const [payload, setPayload] = useState<any>(null);

  useEffect(() => {
    const fetchNamespace = async () => {
      try {
        const data = await window.electronAPI.readNamespace(viewContext.name);
        setNamespace(data);
      } catch (e) {
        console.error("Failed to fetch namespace:", e);
        setError("Failed to fetch namespace.");
      }
    };

    if (viewContext.name) {
      fetchNamespace();
    }
  }, [viewContext.name]);

  const handleUpdate = async () => {
    if (!payload || !namespace) return;
    try {
      // Build labels object with explicit null values for removed labels
      const currentLabels = namespace.metadata?.labels || {};
      const newLabels = payload.metadata?.labels || {};
      const labelsToApply: any = {};
      
      // Add all current labels as null (to be removed unless overridden)
      Object.keys(currentLabels).forEach(key => {
        labelsToApply[key] = null;
      });
      
      // Override with new label values
      Object.keys(newLabels).forEach(key => {
        labelsToApply[key] = newLabels[key];
      });
      
      // Build annotations object with explicit null values for removed annotations
      const currentAnnotations = namespace.metadata?.annotations || {};
      const newAnnotations = payload.metadata?.annotations || {};
      const annotationsToApply: any = {};
      
      // Add all current annotations as null (to be removed unless overridden)
      Object.keys(currentAnnotations).forEach(key => {
        // Skip the last-applied-configuration annotation
        if (key !== 'kubectl.kubernetes.io/last-applied-configuration') {
          annotationsToApply[key] = null;
        }
      });
      
      // Override with new annotation values
      Object.keys(newAnnotations).forEach(key => {
        annotationsToApply[key] = newAnnotations[key];
      });
      
      // Create the update payload
      const updatedNamespace = {
        apiVersion: 'v1',
        kind: 'Namespace',
        metadata: {
          name: namespace.metadata?.name,
          labels: Object.keys(labelsToApply).length > 0 ? labelsToApply : undefined,
          annotations: Object.keys(annotationsToApply).length > 0 ? annotationsToApply : undefined,
        }
      };
      
      // Apply the updated namespace
      const result = await window.electronAPI.apply(dump(updatedNamespace));

      if (result.success) {
        setViewContext({
          resource: Resources.Namespaces,
          action: ResourceAction.Details,
          name: viewContext.name
        })
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to update namespace.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.Namespaces,
      action: ResourceAction.Details,
      name: viewContext.name
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
        <NamespaceBadge />Edit Namespace: {viewContext.name}
      </CreateHeader>

      {namespace && (
        <NamespaceForm 
          namespace={namespace}
          onChange={setPayload}
          isEdit={true}
        />
      )}
    </>
  );
};