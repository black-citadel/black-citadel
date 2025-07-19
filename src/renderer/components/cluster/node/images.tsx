import { useMemo, useState } from 'react';
import k8s from '@kubernetes/client-node';
import { ListTable, type SortConfig, Badge } from '@protoku/design-system';
import { Text } from '@components/base/text';
import { formatBytes } from '@utils/resource-parser';
import { sortRows } from '@utils/sorting';

interface NodeImagesProps {
  node: k8s.V1Node;
}

export const NodeImages = ({ node }: NodeImagesProps): JSX.Element => {
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>();
  const headers = ['Image', 'Size', 'SHA Digests'];
  
  const images = useMemo(() => {
    if (!node.status?.images) return [];
    
    // Group images by their primary name (without SHA)
    const imageMap = new Map<string, {
      primaryName: string;
      shas: string[];
      sizeBytes?: number;
      sizeDisplay: string;
    }>();
    
    node.status.images.forEach(image => {
      const names = image.names || [];
      let primaryName = '';
      const shas: string[] = [];
      
      // Separate tagged names from SHA references
      names.forEach(name => {
        if (name.includes('@sha256:')) {
          shas.push(name.split('@')[1]);
        } else {
          // Prefer the name with a tag
          if (!primaryName || name.includes(':')) {
            primaryName = name;
          }
        }
      });
      
      // If no tagged name found, use the first SHA reference
      if (!primaryName && names.length > 0) {
        primaryName = names[0].split('@')[0] + ' (untagged)';
      }
      
      if (primaryName) {
        const existing = imageMap.get(primaryName);
        if (existing) {
          // Merge SHA references
          existing.shas.push(...shas);
        } else {
          imageMap.set(primaryName, {
            primaryName,
            shas,
            sizeBytes: image.sizeBytes,
            sizeDisplay: formatBytes(image.sizeBytes || 0)
          });
        }
      }
    });
    
    // Convert map to array and sort alphabetically by image name
    return Array.from(imageMap.values()).sort((a, b) => 
      a.primaryName.localeCompare(b.primaryName)
    );
  }, [node.status?.images]);

  // Create data rows with raw values for sorting
  const dataRows = images.map(image => ({
    Image: image.primaryName,
    Size: image.sizeBytes || 0,
    'SHA Digests': image.shas.join(' '),
    _image: image
  }));

  // Sort the data rows
  const sortedRows = sortRows(dataRows, sortConfig);

  // Map sorted data to display components
  const processedRows = sortedRows.map(row => {
    const image = row._image;
    return {
      Image: <Text className="font-medium">{image.primaryName}</Text>,
      Size: <Text>{image.sizeDisplay}</Text>,
      'SHA Digests': (
        <div className="space-y-1">
          {image.shas.length > 0 ? (
            image.shas.map((sha, shaIndex) => (
              <Text key={shaIndex} className="text-xs text-gray-500 font-mono">
                {sha}
              </Text>
            ))
          ) : (
            <Text className="text-xs text-gray-500">-</Text>
          )}
        </div>
      )
    };
  });

  return (
    <div>
      <div className="mb-4">
        <Badge variant="gray">{images.length} images</Badge>
      </div>
      
      {images.length === 0 ? (
        <div className="text-center py-8 text-zinc-500">
          No images found
        </div>
      ) : (
        <ListTable 
          headers={headers} 
          rows={processedRows}
          sortConfig={sortConfig}
          onSort={setSortConfig}
        />
      )}
    </div>
  );
};