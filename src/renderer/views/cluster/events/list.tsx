import { useEffect, useState } from 'react';
import k8s from '@kubernetes/client-node';
import { ListHeader } from '@components/list-header';
import { Resources } from '@utils/enums';
import { EventList } from '@components/cluster/event/table';

export const EventsListView = () => {
  const [events, setEvents] = useState<k8s.CoreV1EventList>();
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listEventForAllNamespaces();
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
  }, []);

  return (
    <>
      <ListHeader resource={Resources.Events} error={error} />
      {events && <EventList events={events} />}
    </>
  );
};

export default EventsListView;