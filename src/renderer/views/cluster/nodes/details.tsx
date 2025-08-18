import { useEffect, useState } from 'react';
import {
  NodeStatus,
  CoreV1EventList,
  V1Node
} from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs , Resources } from "@utils/enums";
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { Heading, Subheading } from '@components/base/heading';
import { NodeBadge } from '@components/cluster/node/badge';
import { MetadataDetails } from '@components/metadata';
import { EventList } from '@components/cluster/event/table';
import { NodeSpec } from '@components/cluster/node/spec';
import { NodeStatus2 } from '@components/cluster/node/status';
import { NodeImages } from '@components/cluster/node/images';
import { Button } from '@protoku/design-system';
import { Alert, AlertTitle, AlertDescription, AlertActions, AlertBody } from '@components/base/alert';
import { Checkbox } from '@components/base/checkbox';
import { Text } from '@components/base/text';
import { NodeTaints } from '@components/cluster/node/taints';
import { ResourceActions } from '@components/resources/ResourceActions';
import { Container } from '@components/base/container';


export const NodeDetailsView = (): JSX.Element => {
    const { viewContext } = useView()
    const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
    const [node, setNode] = useState<V1Node>();
    const [nodeMetrics, setNodeMetrics] = useState<NodeStatus[]>();
    const [events, setEvents] = useState<CoreV1EventList>();
    const [error, setError] = useState<string | null>(null);
    const [cordonAlertOpen, setCordonAlertOpen] = useState(false);
    const [uncordonAlertOpen, setUncordonAlertOpen] = useState(false);
    const [drainAlertOpen, setDrainAlertOpen] = useState(false);
    const [drainOptions, setDrainOptions] = useState({
      ignoreDaemonsets: true,
      deleteEmptyDirData: false,
      force: false,
      gracePeriodSeconds: 30
    });
    const [drainResult, setDrainResult] = useState<{
      success: boolean;
      evictedPods?: string[];
      errors?: string[];
      message?: string;
    } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
  
    const fetchData = async () => {
      try {
        const data = await window.electronAPI.readNode(viewContext.name);
        setNode(data);
        
        // Fetch node metrics
        const metrics = await window.electronAPI.topNodes();
        setNodeMetrics(metrics);
        
        // Fetch events related to this node
        const allEvents = await window.electronAPI.listEventForAllNamespaces();
        const nodeEvents = {
          items: allEvents.items.filter(event => 
            event.involvedObject?.kind === 'Node' && 
            event.involvedObject?.name === viewContext.name
          )
        };
        setEvents(nodeEvents);
        
        setError(null);
      } catch (e) {
        console.error("Failed to fetch node data:", e);
        setError("Failed to fetch node data.");
      }
    };
  
    useEffect(() => {
      fetchData();
      const intervalId = setInterval(fetchData, 5000);
      return () => clearInterval(intervalId);
    }, []);
  
    const yamlContent = dump(node);

    // Find the metrics for the current node
    const currentNodeMetrics = nodeMetrics?.find(metric => metric.Node.metadata?.name === viewContext.name);

    const handleCordon = async () => {
      setIsProcessing(true);
      setCordonAlertOpen(false);
      
      const result = await window.electronAPI.cordonNode(viewContext.name);
      
      if (result.success) {
        await fetchData(); // Refresh node data
      } else {
        setError(result.error || 'Failed to cordon node');
      }
      
      setIsProcessing(false);
    };

    const handleUncordon = async () => {
      setIsProcessing(true);
      setUncordonAlertOpen(false);
      
      const result = await window.electronAPI.uncordonNode(viewContext.name);
      
      if (result.success) {
        await fetchData(); // Refresh node data
      } else {
        setError(result.error || 'Failed to uncordon node');
      }
      
      setIsProcessing(false);
    };

    const handleDrain = async () => {
      setIsProcessing(true);
      setDrainAlertOpen(false);
      setDrainResult(null);
      
      const result = await window.electronAPI.drainNode(viewContext.name, drainOptions);
      
      if (result.success || result.errors?.length) {
        setDrainResult(result);
        await fetchData(); // Refresh node data
      } else {
        setError(result.error || 'Failed to drain node');
      }
      
      setIsProcessing(false);
    };

    const isUnschedulable = node?.spec?.unschedulable === true;
  
    return (
      <>
        <DetailsHeader 
          error={error}
          actions={
            <ResourceActions
              resourceType={Resources.Nodes}
              resourceName={viewContext.name}
              resource={node}
              isLoading={isProcessing}
              customActions={[
                {
                  id: 'cordon',
                  label: isUnschedulable ? 'Uncordon' : 'Cordon',
                  onClick: () => isUnschedulable ? setUncordonAlertOpen(true) : setCordonAlertOpen(true),
                  variant: 'secondary' as const,
                  disabled: isProcessing,
                },
                {
                  id: 'drain',
                  label: 'Drain',
                  onClick: () => setDrainAlertOpen(true),
                  variant: 'secondary' as const,
                  disabled: isProcessing,
                },
              ]}
            />
          }
        >
          <Heading>
            <NodeBadge />{viewContext.name}
          </Heading>

          <Navbar>
            <NavbarSection>
              <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab === ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
              <NavbarItem onClick={() => setActiveTab(ResourceTabs.Images)} current={activeTab === ResourceTabs.Images}>{ResourceTabs.Images}</NavbarItem>
              <NavbarItem onClick={() => setActiveTab(ResourceTabs.Events)} current={activeTab === ResourceTabs.Events}>{ResourceTabs.Events}</NavbarItem>
              <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab === ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
            </NavbarSection>
          </Navbar>
        </DetailsHeader>
  
        {activeTab === ResourceTabs.Details && node && (
          <div className='m-2'>
            <Subheading className='mb-4'>Taints</Subheading>
            <div className="mb-8">
              <NodeTaints taints={node.spec?.taints} />
            </div>

            <NodeStatus2 node={node} nodeMetrics={currentNodeMetrics} />

            <Container title="Spec">
              <NodeSpec node={node} />
            </Container>

            <MetadataDetails metadata={node.metadata} />

          </div>
        )}

        {activeTab === ResourceTabs.Images && node && (
          <div className='m-2'>
            <NodeImages node={node} />
          </div>
        )}

        {activeTab === ResourceTabs.Events && events && (
          <div className='m-2'>
            <EventList events={events} />
          </div>
        )}
  
        {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}

        <Alert open={cordonAlertOpen} onClose={setCordonAlertOpen}>
          <AlertTitle>Cordon Node</AlertTitle>
          <AlertDescription>
            Are you sure you want to cordon this node? This will prevent new pods from being scheduled on this node.
          </AlertDescription>
          <AlertActions>
            <Button variant="secondary" onClick={() => setCordonAlertOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCordon}>Cordon</Button>
          </AlertActions>
        </Alert>

        <Alert open={uncordonAlertOpen} onClose={setUncordonAlertOpen}>
          <AlertTitle>Uncordon Node</AlertTitle>
          <AlertDescription>
            Are you sure you want to uncordon this node? This will allow new pods to be scheduled on this node again.
          </AlertDescription>
          <AlertActions>
            <Button variant="secondary" onClick={() => setUncordonAlertOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUncordon}>Uncordon</Button>
          </AlertActions>
        </Alert>

        <Alert open={drainAlertOpen} onClose={setDrainAlertOpen} size="lg">
          <AlertTitle>Drain Node</AlertTitle>
          <AlertDescription>
            This will evict all pods from the node. Configure drain options below:
          </AlertDescription>
          <AlertBody>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <Checkbox 
                  checked={drainOptions.ignoreDaemonsets}
                  onChange={(checked) => setDrainOptions({...drainOptions, ignoreDaemonsets: checked})}
                />
                <div>
                  <div className="font-medium text-zinc-900 dark:text-white">Ignore DaemonSets</div>
                  <Text className="text-sm text-zinc-500">Skip pods that are part of DaemonSets</Text>
                </div>
              </label>
              
              <label className="flex items-center gap-3">
                <Checkbox 
                  checked={drainOptions.deleteEmptyDirData}
                  onChange={(checked) => setDrainOptions({...drainOptions, deleteEmptyDirData: checked})}
                />
                <div>
                  <div className="font-medium text-zinc-900 dark:text-white">Delete local data</div>
                  <Text className="text-sm text-zinc-500">Delete pods with emptyDir volumes</Text>
                </div>
              </label>
              
              <label className="flex items-center gap-3">
                <Checkbox 
                  checked={drainOptions.force}
                  onChange={(checked) => setDrainOptions({...drainOptions, force: checked})}
                />
                <div>
                  <div className="font-medium text-zinc-900 dark:text-white">Force drain</div>
                  <Text className="text-sm text-zinc-500">Delete standalone pods not managed by controllers</Text>
                </div>
              </label>

              <div className="pt-2">
                <div className="font-medium text-zinc-900 dark:text-white mb-1">Grace period (seconds)</div>
                <input
                  type="number"
                  min="0"
                  value={drainOptions.gracePeriodSeconds}
                  onChange={(e) => setDrainOptions({...drainOptions, gracePeriodSeconds: parseInt(e.target.value) || 30})}
                  className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>
            </div>
          </AlertBody>
          <AlertActions>
            <Button variant="secondary" onClick={() => setDrainAlertOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleDrain}>Drain Node</Button>
          </AlertActions>
        </Alert>

        {drainResult && (
          <Alert open={!!drainResult} onClose={() => setDrainResult(null)} size="lg">
            <AlertTitle>{drainResult.success ? 'Node Drained Successfully' : 'Node Drain Completed with Errors'}</AlertTitle>
            {drainResult.evictedPods && drainResult.evictedPods.length > 0 && (
              <AlertBody>
                <div>
                  <div className="font-medium text-zinc-900 dark:text-white">Evicted pods:</div>
                  <ul className="mt-2 space-y-1 text-sm">
                    {drainResult.evictedPods.map((pod, index) => (
                      <li key={index} className="text-zinc-600 dark:text-zinc-400">• {pod}</li>
                    ))}
                  </ul>
                </div>
              </AlertBody>
            )}
            {drainResult.errors && drainResult.errors.length > 0 && (
              <AlertBody>
                <div>
                  <div className="font-medium text-red-600 dark:text-red-400">Errors:</div>
                  <ul className="mt-2 space-y-1 text-sm">
                    {drainResult.errors.map((error, index) => (
                      <li key={index} className="text-red-600 dark:text-red-400">• {error}</li>
                    ))}
                  </ul>
                </div>
              </AlertBody>
            )}
            <AlertActions>
              <Button variant="primary" onClick={() => setDrainResult(null)}>Close</Button>
            </AlertActions>
          </Alert>
        )}
      </>
    );
}
