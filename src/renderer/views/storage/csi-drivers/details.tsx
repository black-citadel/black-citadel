import { V1CSIDriver } from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { useEffect, useState } from "react";
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { CSIDriverBadge } from '@components/storage/csi-driver/badge';
import { Heading } from '@components/base/heading';
import { ResourceActions } from '@components/resources/ResourceActions';
import { CSIDriverDetails } from '@components/gen/V1CSIDriver/details';

export const CSIDriversDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [csiDriver, setCSIDriver] = useState<V1CSIDriver>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readCSIDriver(viewContext.name);
      setCSIDriver(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch CSI driver:", e);
      setError("Failed to fetch CSI driver.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(csiDriver);

  const handleDelete = async () => {
    await window.electronAPI.deleteCSIDriver(viewContext.name);
    setViewContext({ resource: Resources.CSIDrivers, action: ResourceAction.List });
  };

  const handleEdit = () => {
    setViewContext({
      resource: Resources.CSIDrivers,
      action: ResourceAction.Edit,
      name: viewContext.name
    });
  };

  return (
    <>
      <DetailsHeader 
        error={error}
        actions={
          <ResourceActions
            resourceType={Resources.CSIDrivers}
            resourceName={viewContext.name}
            resource={csiDriver}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        }
      >
        <Heading>
          <CSIDriverBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && csiDriver && <CSIDriverDetails resourceData={csiDriver} />}

      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};