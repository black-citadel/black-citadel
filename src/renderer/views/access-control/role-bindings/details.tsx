import type { V1RoleBinding } from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { useEffect, useState } from "react";
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { RoleBindingBadge } from '@components/access-control/role-binding/badge';
import { SubjectList } from '@components/access-control/subject-list';
import { Heading } from '@components/base/heading';
import { MetadataDetails } from '@components/metadata';
import { RoleResourceLink } from '@components/access-control/role/resource-link';
import { ResourceActions } from '@components/resources/ResourceActions';
import { Container } from '@components/base/container';

export const RoleBindingsDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [roleBinding, setRoleBinding] = useState<V1RoleBinding>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedRoleBinding(viewContext.name, viewContext.namespace);
      setRoleBinding(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch role binding:", e);
      setError("Failed to fetch role binding.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(roleBinding);

  const handleDelete = async () => {
    await window.electronAPI.deleteNamespacedRoleBinding(viewContext.name, viewContext.namespace);
    setViewContext({ resource: Resources.RoleBindings, action: ResourceAction.List });
  };

  return (
    <>
      <DetailsHeader 
        error={error}
        actions={
          <ResourceActions
            resourceType={Resources.RoleBindings}
            resourceName={viewContext.name}
            namespace={viewContext.namespace}
            resource={roleBinding}
            onDelete={handleDelete}
          />
        }
      >
        <Heading>
          <RoleBindingBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && roleBinding && (
        <div className='m-2'>

          <Container title="Role Reference">
            <RoleResourceLink name={roleBinding.roleRef.name} namespace={roleBinding.metadata.namespace} />
            </Container>

          <Container title="Subjects">
            <SubjectList subjects={roleBinding.subjects} />
          </Container>

          <MetadataDetails metadata={roleBinding.metadata} />

        </div>
      )}

      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>

  );
};