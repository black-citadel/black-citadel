import { V1Role } from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { useEffect, useState } from "react";
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { RoleBadge } from '@components/access-control/role/badge';
import { RuleList } from '@components/access-control/cluster-role/rule-list';
import { MetadataDetails } from '@components/metadata';
import { Heading } from '@components/base/heading';
import { ResourceActions } from '@components/resources/ResourceActions';
import { Container } from '@components/base/container';


export const RolesDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [role, setRole] = useState<V1Role>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedRole(viewContext.name, viewContext.namespace);
      setRole(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch role:", e);
      setError("Failed to fetch role.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(role);

  const handleDelete = async () => {
    await window.electronAPI.deleteNamespacedRole(viewContext.name, viewContext.namespace);
    setViewContext({ resource: Resources.Roles, action: ResourceAction.List });
  };

  return (
    <>
      <DetailsHeader 
        error={error}
        actions={
          <ResourceActions
            resourceType={Resources.Roles}
            resourceName={viewContext.name}
            namespace={viewContext.namespace}
            resource={role}
            onDelete={handleDelete}
          />
        }
      >
        <Heading>
          <RoleBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && role && (
        <div className='m-2'>
          
          <Container title="Rules">
            <RuleList rules={role.rules} />
          </Container>

          <MetadataDetails metadata={role.metadata} />
        </div>
      )}

      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>
  );
};