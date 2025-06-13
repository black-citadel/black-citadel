import { useEffect, useState } from 'react';
import k8s from '@kubernetes/client-node';
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


export const NodeDetailsView = (): JSX.Element => {
    const { viewContext } = useView()
    const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
    const [node, setNode] = useState<k8s.V1Node>();
    const [nodeMetrics, setNodeMetrics] = useState<k8s.NodeStatus[]>();
    const [events, setEvents] = useState<k8s.V1EventList>();
    const [error, setError] = useState<string | null>(null);
  
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
  
    return (
      <>
        <DetailsHeader error={error}>
          <Heading>
            <NodeBadge />{viewContext.name}
          </Heading>

          <Navbar>
            <NavbarSection>
              <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab === ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
              <NavbarItem onClick={() => setActiveTab(ResourceTabs.Events)} current={activeTab === ResourceTabs.Events}>{ResourceTabs.Events}</NavbarItem>
              <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab === ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
            </NavbarSection>
          </Navbar>
        </DetailsHeader>
  
        {activeTab === ResourceTabs.Details && node && (
          <div className='m-2'>
            <MetadataDetails metadata={node.metadata} />

            <Subheading className='mt-8 mb-4'>Spec</Subheading>
            <NodeSpec node={node} />

            <Subheading className='mt-8 mb-4'>Status</Subheading>
            <NodeStatus node={node} nodeMetrics={currentNodeMetrics} />
          </div>
        )}

        {activeTab === ResourceTabs.Events && events && (
          <div className='m-2'>
            <EventList events={events} />
          </div>
        )}
  
        {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
      </>
    );
}
