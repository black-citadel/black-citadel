import { V1Pod } from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceAction, Resources, ResourceTabs } from "@utils/enums";
import { useEffect, useState } from "react";
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { PodBadge } from '@components/workloads/pod/badge';
import { Heading } from '@components/base/heading';
import { WorkloadLogs } from '@components/workloads/workload-logs';
import { PortForwardDialog } from '@components/tools/port-forward/dialog';
import { TerminalTab } from '@components/tools/terminal/terminal-tab';
import { PortOption, PortForwardRequest } from '@utils/types';
import { ResourceActions } from '@components/resources/ResourceActions';
import { PodDetails } from '@components/gen/V1Pod/details';

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
      console.log("Fetched pod data:", data);
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

  const handleEdit = () => {
    setViewContext({ 
      resource: Resources.Pods, 
      action: ResourceAction.Edit, 
      name: viewContext.name,
      namespace: viewContext.namespace
    });
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
            onEdit={handleEdit}
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



      {activeTab === ResourceTabs.Details && pod && <PodDetails resourceData={pod} />}

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
