import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { LimitRangeList } from '@components/configuration/limit-range/table';
import { Resources } from '@utils/enums';

export const LimitRangesListView = (): JSX.Element => {
  const [limitRanges, setLimitRanges] = useState<k8s.V1LimitRangeList>();
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      console.log('fetching limit ranges');
      const data = await window.electronAPI.listLimitRangeForAllNamespaces();
      console.log(data);
      setLimitRanges(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch limit ranges:", e);
      setError("Failed to fetch limit ranges.");
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <ListHeader resource={Resources.LimitRanges} error={error} />
      {limitRanges && <LimitRangeList limitRanges={limitRanges} />}
    </>
  );
};