import k8s from '@kubernetes/client-node';
import { useState, useEffect } from 'react';
import { Field } from '@components/base/fieldset';
import { Listbox, ListboxLabel, ListboxOption } from '@components/base/listbox';
import { useView } from '@context/viewProvider'
import { NamespaceBadge } from './cluster/namespace/badge';

export const NamespaceDropdown = (): JSX.Element => {
  const [namespaces, setNamespaces] = useState<k8s.V1NamespaceList>();
  const { activeNamespace, setActiveNamespace } = useView();

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

  const handleNamespaceChange = (value: string) => {
    setActiveNamespace(value);
  };

  return (
    <>
      {namespaces &&
        <Field>
          <Listbox name="status" defaultValue={activeNamespace} onChange={handleNamespaceChange}>
            <ListboxOption value="all">
              <ListboxLabel>All namespaces</ListboxLabel>
            </ListboxOption>
            {namespaces.items.map((namespace) => (
              <ListboxOption key={namespace.metadata.name} value={namespace.metadata.name}>
                <ListboxLabel><NamespaceBadge /> {namespace.metadata.name}</ListboxLabel>
              </ListboxOption>
            ))}
          </Listbox>
        </Field>
      }
    </>
  )
}