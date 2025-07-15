import { useMemo } from 'react';
import k8s from '@kubernetes/client-node';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/base/table';
import { Text } from '@components/base/text';
import { Badge } from '@protoku/design-system';
import { formatBytes } from '@utils/resource-parser';

interface NodeImagesProps {
  node: k8s.V1Node;
}

export const NodeImages = ({ node }: NodeImagesProps): JSX.Element => {
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

  return (
    <div>
      <div className="mb-4">
        <Badge variant="gray">{images.length} images</Badge>
      </div>
      
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Image</TableHeader>
            <TableHeader>Size</TableHeader>
            <TableHeader>SHA Digests</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {images.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                <Text className="text-gray-500">No images found</Text>
              </TableCell>
            </TableRow>
          ) : (
            images.map((image, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Text className="font-medium">{image.primaryName}</Text>
                </TableCell>
                <TableCell>
                  <Text>{image.sizeDisplay}</Text>
                </TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};