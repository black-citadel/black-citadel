import { useEffect, useState } from 'react';
import {
  NodeStatus,
  V1EventList,
  V1Node
} from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs } from "@utils/enums";
import { DetailsItem } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { Heading, Subheading } from '@components/base/heading';
import { NodeBadge } from '@components/cluster/node/badge';
import { MetadataDetails } from '@components/metadata';
import { EventList } from '@components/cluster/event/table';
import { NodeSpec } from '@components/cluster/node/spec';
import { NodeStatus } from '@components/cluster/node/status';
import { NodeImages } from '@components/cluster/node/images';
import { Button } from '@components/base/button';
import { Alert, AlertTitle, AlertDescription, AlertActions } from '@components/base/alert';
import { NodeLabels } from '@components/cluster/node/labels';
import { NodeTaints } from '@components/cluster/node/taints';
import { ResourceActions } from '@components/resources/ResourceActions';
import { Resources } from '@utils/enums';


export const NodeDetailsView = (): JSX.Element => {
    const { viewContext } = useView()
    const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
    const [node, setNode] = useState<V1Node>();
    const [nodeMetrics, setNodeMetrics] = useState<NodeStatus[]>();
    const [events, setEvents] = useState<V1EventList>();
    const [error, setError] = useState<string | null>(null);
    const [cordonAlertOpen, setCordonAlertOpen] = useState(false);
    const [uncordonAlertOpen, setUncordonAlertOpen] = useState(false);
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
            <Subheading className='mb-4'>Labels</Subheading>
            <div className="border p-4 rounded-md border-neutral-800 mb-8">
              <NodeLabels labels={node.metadata?.labels} />
            </div>

            <Subheading className='mb-4'>Taints</Subheading>
            <div className="mb-8">
              <NodeTaints taints={node.spec?.taints} />
            </div>

            <MetadataDetails metadata={node.metadata} />

            <Subheading className='mt-8 mb-4'>Spec</Subheading>
            <NodeSpec node={node} />

            <Subheading className='mt-8 mb-4'>Status</Subheading>
            <NodeStatus node={node} nodeMetrics={currentNodeMetrics} />
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
            <Button plain onClick={() => setCordonAlertOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCordon}>Cordon</Button>
          </AlertActions>
        </Alert>

        <Alert open={uncordonAlertOpen} onClose={setUncordonAlertOpen}>
          <AlertTitle>Uncordon Node</AlertTitle>
          <AlertDescription>
            Are you sure you want to uncordon this node? This will allow new pods to be scheduled on this node again.
          </AlertDescription>
          <AlertActions>
            <Button plain onClick={() => setUncordonAlertOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUncordon}>Uncordon</Button>
          </AlertActions>
        </Alert>
      </>
    );
}
