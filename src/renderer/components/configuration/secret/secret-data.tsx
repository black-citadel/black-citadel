import React from 'react';
import { PanelGrid } from '@components/layout/panel';
import { RevealableText } from '@components/base/revealable-text';

interface SecretDataProps {
  data: Record<string, string>;
}

export const SecretData: React.FC<SecretDataProps> = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <PanelGrid
        title="Secret Data"
        items={[{ label: 'No data', value: '-' }]}
        columns={1}
      />
    );
  }

  const items = Object.entries(data).map(([key, value]) => ({
    label: key,
    value: <RevealableText value={value} isBase64={true} />
  }));

  return (
    <PanelGrid
      title="Secret Data"
      items={items}
      columns={1}
    />
  );
};