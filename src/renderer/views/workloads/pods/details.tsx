import { V1Pod } from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceAction, Resources, ResourceTabs } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsItem, } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { PodBadge } from '@components/workloads/pod/badge';
import { MetadataDetails } from '@components/metadata';
import { Heading, Subheading } from '@components/base/heading';
import { Description, Field, Label } from '@components/base/fieldset';
import { HelpButton } from '@components/help-button';
import helpObjects from '@help/index';
import { WorkloadLogs } from '@components/workloads/workload-logs';
import { ContainerResources } from '@components/base/container-resources';
import { Badge } from '@components/base/badge';
import { Button } from '@components/base/button';
import { PortForwardDialog } from '@components/tools/port-forward/dialog';
import { TerminalTab } from '@components/tools/terminal/terminal-tab';
import { PortOption, PortForwardRequest } from '@utils/types';
import { ResourceActions } from '@components/resources/ResourceActions';

export const PodsDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [pod, setPod] = useState<V1Pod>();
  const [error, setError] = useState(null);
  const [showPortForwardDialog, setShowPortForwardDialog] = useState(false);
  const [portForwardSuccess, setPortForwardSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedPod(viewContext.name, viewContext.namespace);
      setPod(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch pod:", e);
      setError("Failed to fetch pod.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(pod);

  const handleDelete = async () => {
    await window.electronAPI.deleteNamespacedPod(viewContext.name, viewContext.namespace);
    setViewContext({ resource: Resources.Pods, action: ResourceAction.List });
  };

  const getAvailablePorts = (): PortOption[] => {
    if (!pod?.spec?.containers) return [];
    
    const ports: PortOption[] = [];
    pod.spec.containers.forEach(container => {
      container.ports?.forEach(port => {
        ports.push({
          name: port.name,
          port: port.containerPort,
          protocol: port.protocol || 'TCP'
        });
      });
    });
    
    return ports;
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
            resourceType={Resources.Pods}
            resourceName={viewContext.name}
            namespace={viewContext.namespace}
            resource={pod}
            onDelete={handleDelete}
            onNavigate={(path) => console.log('Navigate to:', path)}
            customActions={
              pod?.status?.phase === 'Running' && getAvailablePorts().length > 0 ? [{
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
          <PodBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.Logs)} current={activeTab == ResourceTabs.Logs}>{ResourceTabs.Logs}</NavbarItem>
            {pod?.status?.phase === 'Running' && (
              <NavbarItem onClick={() => setActiveTab(ResourceTabs.Terminal)} current={activeTab == ResourceTabs.Terminal}>{ResourceTabs.Terminal}</NavbarItem>
            )}
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
          </NavbarSection>
        </Navbar>
      </DetailsHeader>



      {activeTab === ResourceTabs.Details && pod && (

        <div className='m-2'>
          <MetadataDetails metadata={pod.metadata} />

          <Subheading className='mt-8 mb-4'>Status</Subheading>

          <div>

            <Field className="grid gap-x-8 gap-y-6 grid-cols-2 my-8">
              <div className='px-4'>
                <Label>Phase <HelpButton title="Phase" content={helpObjects.pod.phase.help} /></Label>
                <Description>
                  The phase of a Pod is a simple, high-level summary of where the Pod is in its lifecycle.
                </Description>
              </div>
              <div className='px-4'>
                <span style={{ color: pod.status.phase === 'Running' ? 'green' : 'inherit' }}>
                  {pod.status.phase}
                </span>
              </div>
            </Field>
            <DetailsItem label="Pod IP">
              {pod.status.podIP}
            </DetailsItem>
            <DetailsItem label="Host IP">
              {pod.status.hostIP}
            </DetailsItem>
            <DetailsItem label="Start Time">
              {pod.status.startTime?.toLocaleString()}
            </DetailsItem>
          </div>

          <Subheading className='mt-8 mb-4'>Configuration</Subheading>

          <div>
            <DetailsItem label="Node">
              {pod.spec.nodeName}
            </DetailsItem>
            <DetailsItem label="Service Account">
              {pod.spec.serviceAccountName}
            </DetailsItem>
            <DetailsItem label="Restart Policy">
              {pod.spec.restartPolicy}
            </DetailsItem>
            <DetailsItem label="Node Selector">
              {Object.entries(pod.spec.nodeSelector || {}).map(([key, value]) => (
                <div key={key}>{key}: {value}</div>
              ))}
            </DetailsItem>
            <DetailsItem label="Tolerations">
              {pod.spec.tolerations?.map((toleration, index) => (
                <div key={index}>
                  {toleration.key}: {toleration.operator} {toleration.value}
                </div>
              ))}
            </DetailsItem>
          </div>

          {/* Containers Section */}
          <Subheading className='mt-8 mb-4'>Containers</Subheading>
          <div className="space-y-4">
            {pod.spec.containers.map((container, index) => {
              const containerStatus = pod.status?.containerStatuses?.find(
                status => status.name === container.name
              );
              
              return (
                <div key={index} className="border border-neutral-800 rounded-md p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium">{container.name}</h4>
                    {containerStatus && (
                      <Badge variant={containerStatus.ready ? 'success' : 'error'}>
                        {containerStatus.ready ? 'Ready' : 'Not Ready'}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <DetailsItem label="Image">
                      <span className="text-sm">{container.image}</span>
                    </DetailsItem>
                    
                    {container.ports && container.ports.length > 0 && (
                      <DetailsItem label="Ports">
                        <span className="text-sm">
                          {container.ports.map(port => `${port.containerPort}/${port.protocol || 'TCP'}`).join(', ')}
                        </span>
                      </DetailsItem>
                    )}
                    
                    {containerStatus && (
                      <>
                        <DetailsItem label="Container ID">
                          <span className="text-sm text-zinc-500">{containerStatus.containerID || 'N/A'}</span>
                        </DetailsItem>
                        <DetailsItem label="Restart Count">
                          <span className="text-sm">{containerStatus.restartCount}</span>
                        </DetailsItem>
                      </>
                    )}
                  </div>
                  
                  {/* Resource Usage */}
                  <div className="mt-4">
                    <h5 className="text-sm font-medium mb-2">Resources</h5>
                    <ContainerResources 
                      container={container}
                      containerStatus={containerStatus}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Init Containers Section (if any) */}
          {pod.spec.initContainers && pod.spec.initContainers.length > 0 && (
            <>
              <Subheading className='mt-8 mb-4'>Init Containers</Subheading>
              <div className="space-y-4">
                {pod.spec.initContainers.map((container, index) => {
                  const containerStatus = pod.status?.initContainerStatuses?.find(
                    status => status.name === container.name
                  );
                  
                  return (
                    <div key={index} className="border border-neutral-800 rounded-md p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium">{container.name}</h4>
                        {containerStatus && (
                          <Badge variant={containerStatus.ready ? 'success' : 'secondary'}>
                            {containerStatus.ready ? 'Complete' : 'Pending'}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <DetailsItem label="Image">
                          <span className="text-sm">{container.image}</span>
                        </DetailsItem>
                        
                        {containerStatus && (
                          <DetailsItem label="Restart Count">
                            <span className="text-sm">{containerStatus.restartCount}</span>
                          </DetailsItem>
                        )}
                      </div>
                      
                      {/* Resource Usage */}
                      <div className="mt-4">
                        <h5 className="text-sm font-medium mb-2">Resources</h5>
                        <ContainerResources 
                          container={container}
                          containerStatus={containerStatus}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

        </div>
      )}


      {activeTab === ResourceTabs.Logs && pod && (
        <div className='m-2'>
          <WorkloadLogs
            pods={[pod]}
            namespace={pod.metadata.namespace}
          />
        </div>
      )}

      {activeTab === ResourceTabs.Terminal && pod && (
        <div className='m-2'>
          <TerminalTab
            pod={pod}
            namespace={viewContext.namespace}
          />
        </div>
      )}

      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}

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
        resourceType="pod"
        resourceName={viewContext.name}
        namespace={viewContext.namespace}
        availablePorts={getAvailablePorts()}
        onSubmit={handlePortForward}
      />

    </>
  );
};
