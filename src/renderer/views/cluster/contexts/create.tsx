import { useState } from 'react';
import { useView } from '@context/viewProvider'
import { ContextBadge } from '@components/cluster/context/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@components/base/button';
import { ResourceAction, Resources } from '@utils/enums';
import { Textarea } from '@components/base/textarea';

export const ContextsCreateView = (): JSX.Element => {
  const { setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [kubeconfig, setKubeconfig] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  
  const handleCreate = async () => {
    try {
      setError(null);
      setSuccess(false);
      
      if (!kubeconfig.trim()) {
        setError("Please paste a valid kubeconfig");
        return;
      }

      // Parse the kubeconfig to validate it
      let parsedConfig;
      try {
        parsedConfig = JSON.parse(kubeconfig);
      } catch {
        // If JSON parse fails, try YAML parse
        // For now, we'll assume the backend handles YAML parsing
        parsedConfig = { raw: kubeconfig };
      }

      const result = await window.electronAPI.mergeKubeconfig(kubeconfig);
      
      if (result.success) {
        setSuccess(true);
        setKubeconfig('');
        
        // Navigate back to contexts list after a short delay
        setTimeout(() => {
          setViewContext({
            resource: Resources.Contexts,
            action: ResourceAction.List
          });
        }, 1500);
      } else {
        setError(result.error || 'Failed to add context');
      }
    } catch (e) {
      console.error("Failed to create context:", e);
      setError("Failed to create context: " + (e.message || e));
    }
  };

  return (
    <>
      <CreateHeader error={error}>
        <ContextBadge />Add New Context
      </CreateHeader>

      <div className="space-y-4 max-w-4xl">
        <div>
          <label htmlFor="kubeconfig" className="block text-sm font-medium leading-6 text-zinc-400 mb-2">
            Paste your kubeconfig YAML below
          </label>
          <p className="text-sm text-zinc-500 mb-3">
            The kubeconfig should contain cluster, context, and user information. All contexts from the config will be imported.
          </p>
          <Textarea
            id="kubeconfig"
            name="kubeconfig"
            value={kubeconfig}
            onChange={(e) => setKubeconfig(e.target.value)}
            placeholder={`apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LS0tLS1...
    server: https://kubernetes.example.com
  name: my-cluster
contexts:
- context:
    cluster: my-cluster
    user: my-user
  name: my-context
users:
- name: my-user
  user:
    token: ...`}
            rows={20}
            className="font-mono text-sm"
          />
        </div>

        {success && (
          <div className="border border-green-700 text-green-700 px-3 py-2 rounded" role="alert">
            <span className="block sm:inline">Context(s) added successfully! Redirecting...</span>
          </div>
        )}

        <div className="flex gap-3">
          <Button onClick={handleCreate} outline>
            Add Context
          </Button>
          <Button 
            onClick={() => setViewContext({ resource: Resources.Contexts, action: ResourceAction.List })} 
            outline
          >
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
};
