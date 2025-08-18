import k8s from '@kubernetes/client-node';
import { useState, useEffect } from 'react';
import { Listbox, ListboxLabel, ListboxOption } from '@components/base/listbox';
import { NamespaceBadge } from '../cluster/namespace/badge';

interface NamespaceSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const NamespaceSelect = ({ value, onChange }: NamespaceSelectProps): JSX.Element => {
  const [namespaces, setNamespaces] = useState<k8s.V1NamespaceList>();

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listNamespace();
      setNamespaces(data);
    } catch (e) {
      console.error("Failed to fetch Namespaces:", e);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {namespaces &&
        <Listbox name="namespace" value={value} onChange={onChange}>
          <ListboxOption value="">
            <ListboxLabel>Select a namespace</ListboxLabel>
          </ListboxOption>
          {namespaces.items.map((namespace) => (
            <ListboxOption key={namespace.metadata.name} value={namespace.metadata.name}>
              <ListboxLabel><NamespaceBadge /> {namespace.metadata.name}</ListboxLabel>
            </ListboxOption>
          ))}
        </Listbox>
      }
    </>
  );
};
