import {
  V1PodList,
  V1Service
} from '@utils/k8s-types';
import { Heading, Subheading } from "@components/base/heading";
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceAction, Resources, ResourceTabs } from "@utils/enums";
import { useEffect, useState } from "react";
import { ServicePorts } from '@components/networking/service/service-ports';
import { ServiceBadge } from '@components/networking/service/badge';
import { DetailsItem, DetailsSelector } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { PodList } from '@components/workloads/pod/table';
import { DetailsHeader } from '@components/details-header';
import { MetadataDetails } from '@components/metadata';
import { PortForwardDialog } from '@components/tools/port-forward/dialog';
import { PortOption, PortForwardRequest } from '@utils/types';
import { ResourceActions } from '@components/resources/ResourceActions';

function getLabelSelectorString(selector: { [key: string]: string }): string {
  return Object.keys(selector)
    .map((key) => `${key}=${selector[key]}`)
    .join(',');
}

export const ServicesDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [service, setService] = useState<V1Service>();
  const [pods, setPods] = useState<V1PodList>();
  const [error, setError] = useState(null);
  const [showPortForwardDialog, setShowPortForwardDialog] = useState(false);
  const [portForwardSuccess, setPortForwardSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedService(viewContext.name, viewContext.namespace);
      setService(data);
      setError(null);

      const data2 = await window.electronAPI.listNamespacedPod(data.metadata.namespace, undefined, undefined, undefined, undefined, getLabelSelectorString(data.spec.selector));
      setPods(data2);

    } catch (e) {
      console.error("Failed to fetch services:", e);
      setError("Failed to fetch services.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(service);

  const handleDelete = async () => {
    await window.electronAPI.deleteNamespacedService(viewContext.name, viewContext.namespace);
    setViewContext({ resource: Resources.Services, action: ResourceAction.List });
  };

  const getAvailablePorts = (): PortOption[] => {
    if (!service?.spec?.ports) return [];
    
    return service.spec.ports.map(port => ({
      name: port.name,
      port: port.port,
      protocol: port.protocol || 'TCP',
      targetPort: port.targetPort
    }));
  };

  const handlePortForward = async (request: PortForwardRequest, openInBrowser: boolean) => {
    const result = await window.electronAPI.createPortForward(request);
    if (result.success) {
      setPortForwardSuccess(`Port forward established on localhost:${result.localPort}`);
      setTimeout(() => setPortForwardSuccess(null), 5000);
      
      // Open in browser if requested
      if (openInBrowser && result.localPort) {
        const isHttps = request.remotePort === 443 || request.remotePort === 8443;
        const url = `${isHttps ? 'https' : 'http'}://localhost:${result.localPort}`;
        await window.electronAPI.openExternalLink(url);
      }
    } else {
      throw new Error(result.error || 'Failed to create port forward');
    }
  };

  return (
    <>
      <DetailsHeader 
        error={error}
        actions={
          <ResourceActions
            resourceType={Resources.Services}
            resourceName={viewContext.name}
            namespace={viewContext.namespace}
            resource={service}
            onDelete={handleDelete}
            customActions={
              service && getAvailablePorts().length > 0 ? [{
                id: 'port-forward',
                label: 'Port Forward',
                onClick: () => setShowPortForwardDialog(true),
                variant: 'secondary' as const,
              }] : []
            }
          />
        }
      >
        <Heading>
          <ServiceBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
          </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && service &&
        <div className='m-2'>
          <Subheading className='mt-8 mb-4'>Configuration</Subheading>
          <div className="grid grid-cols-3 gap-4">
            <DetailsSelector labels={service.spec.selector} />

            <DetailsItem label="Type">
              {service.spec.type}
            </DetailsItem>

            <DetailsItem label="Cluster IP">
              {service.spec.clusterIP}
            </DetailsItem>
          </div>

          <Subheading className='mt-8 mb-4'>Ports</Subheading>
          <ServicePorts ports={service.spec.ports} />

          <Subheading className='mt-8 mb-4'>Pods</Subheading>
          {pods && <PodList pods={pods} />}

          <MetadataDetails metadata={service.metadata} />
        </div>
      }

      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}

      {portForwardSuccess && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="border border-green-700 bg-green-50 text-green-700 px-4 py-3 rounded-lg shadow-lg" role="alert">
            <span className="block sm:inline">{portForwardSuccess}</span>
          </div>
        </div>
      )}

      <PortForwardDialog
        isOpen={showPortForwardDialog}
        onClose={() => setShowPortForwardDialog(false)}
        resourceType="service"
        resourceName={viewContext.name}
        namespace={viewContext.namespace}
        availablePorts={getAvailablePorts()}
        onSubmit={handlePortForward}
      />
    </>
  );
};