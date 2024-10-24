import { useEffect, useState } from 'react';
import k8s from '@kubernetes/client-node';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs } from "@utils/enums";
import { DetailsItem } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { Subheading } from '@components/base/heading';


export const NodeDetailsView = (): JSX.Element => {
    const { viewContext } = useView()
    const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
    const [node, setNode] = useState<k8s.V1Node>();
    const [nodeMetrics, setNodeMetrics] = useState<k8s.NodeStatus[]>();
    const [error, setError] = useState<string | null>(null);
  
    const fetchData = async () => {
      try {
        const data = await window.electronAPI.readNode(viewContext.name);
        setNode(data);
        
        // Fetch node metrics
        const metrics = await window.electronAPI.topNodes();
        setNodeMetrics(metrics);
        
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
        <DetailsHeader error={error}>{viewContext.name}</DetailsHeader>
        <Navbar>
          <NavbarSection>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab === ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab === ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
          </NavbarSection>
        </Navbar>
  
        {activeTab === ResourceTabs.Details && node && (
          <div className='m-2'>
            <Subheading className='mt-8 mb-4'>Node Info</Subheading>
            <DetailsItem label="Kubernetes Version">
              {node.status?.nodeInfo?.kubeletVersion || 'Not available'}
            </DetailsItem>
            <DetailsItem label="OS">
              {node.status?.nodeInfo?.osImage || 'Not available'}
            </DetailsItem>
            <DetailsItem label="Architecture">
              {node.status?.nodeInfo?.architecture || 'Not available'}
            </DetailsItem>

            <Subheading className='mt-8 mb-4'>Capacity</Subheading>
            <DetailsItem label="CPU">
              {node.status?.capacity?.cpu || 'Not available'}
            </DetailsItem>
            <DetailsItem label="Memory">
              {node.status?.capacity?.memory || 'Not available'}
            </DetailsItem>

            {currentNodeMetrics && (
              <>
                <Subheading className='mt-8 mb-4'>Resource Usage</Subheading>
                <DetailsItem label="CPU Usage">
                  {`${currentNodeMetrics.CPU.LimitTotal} / ${currentNodeMetrics.CPU.RequestTotal} / ${currentNodeMetrics.CPU.Capacity} (${((Number(currentNodeMetrics.CPU.RequestTotal) / Number(currentNodeMetrics.CPU.Capacity)) * 100).toFixed(2)}%)`}
                </DetailsItem>
                <DetailsItem label="Memory Usage">
                  {`${currentNodeMetrics.Memory.RequestTotal} / ${currentNodeMetrics.Memory.Capacity} (${((Number(currentNodeMetrics.Memory.RequestTotal) / Number(currentNodeMetrics.Memory.Capacity)) * 100).toFixed(2)}%)`}
                </DetailsItem>
              </>
            )}

            <Subheading className='mt-8 mb-4'>Conditions</Subheading>
            {node.status?.conditions?.map((condition, index) => (
              <DetailsItem key={index} label={condition.type || ''}>
                {condition.status || 'Unknown'}
              </DetailsItem>
            ))}
          </div>
        )}
  
        {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
      </>
    );
}
