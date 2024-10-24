import k8s = require('@kubernetes/client-node');
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsAnnotations, DetailsItem, DetailsLabels, DetailsName, DetailsNamespace } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { ReplicaSetBadge } from '@components/workloads/replicaset/badge';
import { PodTemplate } from '@components/workloads/pod/template';
import { ReplicaSetStatus } from '@components/workloads/replicaset/status';
import { Heading } from '@components/base/heading';

export const ReplicaSetsDetailsView = (): JSX.Element => {
  const { viewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [replicaSet, setReplicaSet] = useState<k8s.V1ReplicaSet>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedReplicaSet(viewContext.name, viewContext.namespace);
      setReplicaSet(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch replica set:", e);
      setError("Failed to fetch replica set.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(replicaSet);

  return (
    <>
      <DetailsHeader error={error}>
        <Heading>
          <ReplicaSetBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
          </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && replicaSet && (
        <div className="grid grid-cols-2 gap-4">
          <div className='m-2'>
            <DetailsName name={replicaSet.metadata.name} />
            <DetailsNamespace name={replicaSet.metadata.namespace} />
            <DetailsLabels labels={replicaSet.metadata.labels} />
            <DetailsAnnotations annotations={replicaSet.metadata.annotations} />
          </div>

          <div className='m-2'>
            <DetailsItem label="Replicas">
              {replicaSet.spec.replicas}
            </DetailsItem>
            <DetailsItem label="Selector">
              {Object.entries(replicaSet.spec.selector.matchLabels || {}).map(([key, value]) => (
                <div key={key}>{key}: {value}</div>
              ))}
            </DetailsItem>
            <DetailsItem label="Min Ready Seconds">
              {replicaSet.spec.minReadySeconds}
            </DetailsItem>
            <PodTemplate template={replicaSet.spec.template} />
            <ReplicaSetStatus status={replicaSet.status} />
          </div>
        </div>
      )}

      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};