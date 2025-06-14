import { useState, useEffect } from 'react';
import { Dialog } from '@components/base/dialog';
import { Button } from '@components/base/button';
import { Input } from '@components/base/input';
import { Select } from '@components/base/select';
// Removed Alert import - using inline error display instead
import { Text } from '@components/base/text';
import { PortOption, PortForwardRequest } from '@utils/types';
import { Heading } from '@components/base/heading';

interface PortForwardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  resourceType: 'pod' | 'service';
  resourceName: string;
  namespace: string;
  availablePorts: PortOption[];
  onSubmit: (request: PortForwardRequest) => Promise<void>;
}

export const PortForwardDialog = ({
  isOpen,
  onClose,
  resourceType,
  resourceName,
  namespace,
  availablePorts,
  onSubmit
}: PortForwardDialogProps) => {
  const [selectedPort, setSelectedPort] = useState<number | null>(null);
  const [localPort, setLocalPort] = useState<string>('');
  const [localAddress, setLocalAddress] = useState('127.0.0.1');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default values when dialog opens
  useEffect(() => {
    if (isOpen && availablePorts.length > 0) {
      setSelectedPort(availablePorts[0].port);
      // Suggest local port based on remote port
      const suggestedPort = availablePorts[0].port >= 1024 ? availablePorts[0].port : 8080;
      setLocalPort(suggestedPort.toString());
    }
  }, [isOpen, availablePorts]);

  const handleSubmit = async () => {
    if (!selectedPort) {
      setError('Please select a port to forward');
      return;
    }

    const parsedLocalPort = parseInt(localPort);
    if (!parsedLocalPort || parsedLocalPort < 1 || parsedLocalPort > 65535) {
      setError('Local port must be between 1 and 65535');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const request: PortForwardRequest = {
        resourceType,
        resourceName,
        namespace,
        remotePort: selectedPort,
        localPort: parsedLocalPort,
        localAddress: showAdvanced ? localAddress : undefined
      };

      await onSubmit(request);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create port forward');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPortInfo = availablePorts.find(p => p.port === selectedPort);

  return (
    <Dialog open={isOpen} onClose={() => onClose()}>
      <div className="p-6 space-y-4">
        <Heading>Port Forward</Heading>
        
        <div className="space-y-2">
          <Text>
            Forward traffic from <strong>{resourceType === 'pod' ? 'Pod' : 'Service'}</strong> <strong>{resourceName}</strong> in namespace <strong>{namespace}</strong>
          </Text>
        </div>

        {error && (
          <div className="border border-red-700 text-red-700 px-2 py-1.5 rounded" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Remote Port</label>
            <Select
              value={selectedPort?.toString() || ''}
              onChange={(e) => setSelectedPort(parseInt(e.target.value))}
            >
              {availablePorts.map((port) => (
                <option key={port.port} value={port.port}>
                  {port.port} {port.name && `(${port.name})`} - {port.protocol}
                </option>
              ))}
            </Select>
            {selectedPortInfo?.targetPort && (
              <Text size="sm" className="mt-1 text-gray-500">
                Target port: {selectedPortInfo.targetPort}
              </Text>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Local Port</label>
            <Input
              type="number"
              value={localPort}
              onChange={(e) => setLocalPort(e.target.value)}
              placeholder="8080"
              min="1"
              max="65535"
            />
            <Text size="sm" className="mt-1 text-gray-500">
              The port on your local machine to forward to
            </Text>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Options
            </button>
          </div>

          {showAdvanced && (
            <div>
              <label className="block text-sm font-medium mb-1">Local Address</label>
              <Input
                type="text"
                value={localAddress}
                onChange={(e) => setLocalAddress(e.target.value)}
                placeholder="127.0.0.1"
              />
              <Text size="sm" className="mt-1 text-gray-500">
                The local address to bind to (default: 127.0.0.1)
              </Text>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Start Port Forward'}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};