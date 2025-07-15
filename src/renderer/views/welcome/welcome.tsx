import { useEffect, useState } from 'react';
import { Logo } from '@components/base/logo';
import { Button } from '@protoku/design-system';
import { Heading } from '@components/base/heading';
import { Text } from '@components/base/text';
import { Dialog, DialogTitle, DialogBody, DialogActions } from '@components/base/dialog';
import { Textarea } from '@components/base/textarea';
import { useView } from '@context/viewProvider';
import { Resources, ResourceAction } from '@utils/enums';

interface Context {
  name: string;
  cluster: string;
  user: string;
  namespace?: string;
}

export const WelcomeView = () => {
  const [contexts, setContexts] = useState<Context[]>([]);
  const [currentContext, setCurrentContext] = useState<string | null>(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [kubeconfigYaml, setKubeconfigYaml] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const { setViewContext, setActiveContext } = useView();

  useEffect(() => {
    fetchContexts();
  }, []);

  const fetchContexts = async () => {
    try {
      const [contexts, current] = await Promise.all([
        window.electronAPI.getContexts(),
        window.electronAPI.getCurrentContext()
      ]);
      setContexts(contexts || []);
      setCurrentContext(current);
    } catch (error) {
      console.error('Failed to fetch contexts:', error);
    }
  };

  const handleSelectContext = async (contextName: string) => {
    try {
      await window.electronAPI.setCurrentContext(contextName);
      setActiveContext(contextName);
      // Navigate to namespaces view after selecting context
      setViewContext({ resource: Resources.Namespaces, action: ResourceAction.List });
    } catch (error) {
      console.error('Failed to set context:', error);
    }
  };

  const handleImportKubeconfig = async () => {
    try {
      setImportError(null);
      const result = await window.electronAPI.mergeKubeconfig(kubeconfigYaml);
      
      if (result.success) {
        setImportSuccess(true);
        // Refresh contexts after import
        await fetchContexts();
        setTimeout(() => {
          setIsImportDialogOpen(false);
          setKubeconfigYaml('');
          setImportSuccess(false);
        }, 1500);
      } else {
        setImportError(result.error || 'Failed to import kubeconfig');
      }
    } catch (error) {
      setImportError('Failed to import kubeconfig: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090a] flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Logo and Title */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Logo className="w-20 h-20" />
          </div>
          <Text className="text-gray-600 dark:text-gray-400 text-lg">
            Unified Interface for Cloud-Native Operations
          </Text>
        </div>

        {/* Main Content */}
        <div className="bg-[#101010] border border-neutral-800 rounded-sm p-8 mb-8">
          <Heading className="mb-6">
            Select a Kubernetes context
          </Heading>
          
          {contexts.length === 0 ? (
            <div className="text-center py-8">
              <Text className="text-gray-600 dark:text-gray-400 mb-6">
                No Kubernetes contexts found. Import your kubeconfig to get started.
              </Text>
              <Button 
                variant="primary"
                onClick={() => setIsImportDialogOpen(true)}
                className="mx-auto"
              >
                Add new Context
              </Button>
            </div>
          ) : (
            <>
              
              <div className="space-y-3">
                {contexts.map((context) => (
                  <div
                    key={context.name}
                    className={`
                      border rounded-sm p-4 cursor-pointer transition-all group
                      ${context.name === currentContext 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-neutral-800 hover:border-neutral-700'
                      }
                    `}
                    onClick={() => handleSelectContext(context.name)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <Heading className="mb-1 group-hover:text-blue-400 transition-colors">
                          {context.name}
                        </Heading>
                        <Text className="text-sm text-gray-600 dark:text-gray-400">
                          Cluster: {context.cluster}
                        </Text>
                        <Text className="text-sm text-gray-600 dark:text-gray-400">
                          User: {context.user}
                        </Text>
                        {context.namespace && (
                          <Text className="text-sm text-gray-600 dark:text-gray-400">
                            Namespace: {context.namespace}
                          </Text>
                        )}
                      </div>
                      {context.name === currentContext && (
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase">
                          Current
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <div className="flex justify-end">
                  <Button 
                    variant="primary"
                    onClick={() => setIsImportDialogOpen(true)}
                  >
                    Add new Context
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Import Dialog */}
      <Dialog
        open={isImportDialogOpen}
        onClose={() => {
          setIsImportDialogOpen(false);
          setKubeconfigYaml('');
          setImportError(null);
          setImportSuccess(false);
        }}
      >
        <DialogTitle>Import Kubeconfig</DialogTitle>
        <DialogBody>
          {importError && (
            <div className="mb-4 p-4 rounded-md border border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400">
              {importError}
            </div>
          )}
          
          {importSuccess ? (
            <div className="p-4 rounded-md border border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400">
              Kubeconfig imported successfully!
            </div>
          ) : (
            <>
              <Text className="text-gray-600 dark:text-gray-400 mb-4">
                Paste your kubeconfig YAML below. It will be merged with your existing configuration.
              </Text>
              
              <Textarea
                value={kubeconfigYaml}
                onChange={(e) => setKubeconfigYaml(e.target.value)}
                rows={15}
                placeholder="apiVersion: v1
kind: Config
clusters:
- cluster:
    server: https://...
  name: my-cluster
..."
                className="font-mono text-sm"
              />
            </>
          )}
        </DialogBody>
        
        {!importSuccess && (
          <DialogActions>
            <Button
              variant="secondary"
              onClick={() => {
                setIsImportDialogOpen(false);
                setKubeconfigYaml('');
                setImportError(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleImportKubeconfig}
              disabled={!kubeconfigYaml.trim()}
            >
              Import
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
};

export default WelcomeView;