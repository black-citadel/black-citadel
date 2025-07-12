import { useEffect, useState } from 'react';
import { CoreV1EventList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { Resources } from '@utils/enums';
import { EventList } from '@components/cluster/event/table';
import { useView } from '@context/viewProvider';

export const EventsListView = () => {
  const [events, setEvents] = useState<CoreV1EventList>();
  const [error, setError] = useState<string | null>(null);
  const { activeNamespace } = useView();

  const fetchData = async () => {
    try {
      let data: CoreV1EventList;
      
      if (activeNamespace && activeNamespace !== 'all') {
        // Fetch events for specific namespace
        console.log('Fetching events for namespace:', activeNamespace);
        data = await window.electronAPI.listNamespacedEvent(activeNamespace);
        console.log('Received events for namespace:', activeNamespace, 'Count:', data.items?.length);
      } else {
        // Fetch events for all namespaces
        console.log('Fetching events for all namespaces');
        data = await window.electronAPI.listEventForAllNamespaces();
        console.log('Received all events. Count:', data.items?.length);
      }
      
      setEvents(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch Events:", e);
      setError("Failed to fetch Events.");
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, [activeNamespace]);

  return (
    <>
      <ListHeader 
        resource={Resources.Events} 
        error={error}
        showNamespaceDropdown={true}
      />
      {events && <EventList events={events} />}
    </>
  );
};

export default EventsListView;