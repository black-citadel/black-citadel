import k8s = require('@kubernetes/client-node');
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsAnnotations, DetailsItem, DetailsLabels, DetailsName } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { ClusterRoleBadge } from '@components/access-control/cluster-role/badge';
import { RuleList } from '@components/access-control/cluster-role/rule-list';
import { AggregationRuleList } from '@components/access-control/cluster-role/aggregation-rule-list';
import { Heading, Subheading } from '@components/base/heading';
import { MetadataDetails } from '@components/metadata';
import { ResourceActions } from '@components/resources/ResourceActions';


export const ClusterRolesDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [clusterRole, setClusterRole] = useState<k8s.V1ClusterRole>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readClusterRole(viewContext.name);
      setClusterRole(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch cluster role:", e);
      setError("Failed to fetch cluster role.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(clusterRole);

  const handleDelete = async () => {
    await window.electronAPI.deleteClusterRole(viewContext.name);
    setViewContext({ resource: Resources.ClusterRoles, action: ResourceAction.List });
  };

  return (
    <>
      <DetailsHeader 
        error={error}
        actions={
          <ResourceActions
            resourceType={Resources.ClusterRoles}
            resourceName={viewContext.name}
            resource={clusterRole}
            onDelete={handleDelete}
          />
        }
      >
        <Heading>
          <ClusterRoleBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && clusterRole && (
        <div className='m-2'>
          <MetadataDetails metadata={clusterRole.metadata} />

          <Subheading className='mt-8 mb-4'>Rules</Subheading>
          <RuleList rules={clusterRole.rules} />
        </div>
      )}

      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>
  );
};