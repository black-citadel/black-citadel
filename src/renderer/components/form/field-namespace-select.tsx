import React, { useState, useEffect } from 'react';
import k8s from '@kubernetes/client-node';
import { Field, Label, Description } from "@components/base/fieldset";
import { Listbox, ListboxLabel, ListboxOption } from '@components/base/listbox';
import { NamespaceBadge } from '../cluster/namespace/badge';

interface FieldNamespaceSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function FieldNamespaceSelect({ value, onChange }: FieldNamespaceSelectProps) {
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
    <Field className="my-8">
      <Label>Namespace</Label>
      <Description>
        Select the namespace.
      </Description>
      {namespaces && (
        <Listbox name="namespace" value={value} onChange={onChange}>
          {namespaces.items.map((namespace) => (
            <ListboxOption key={namespace.metadata.name} value={namespace.metadata.name}>
              <ListboxLabel><NamespaceBadge /> {namespace.metadata.name}</ListboxLabel>
            </ListboxOption>
          ))}
        </Listbox>
      )}
    </Field>
  );
}
