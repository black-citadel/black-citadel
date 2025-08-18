import { useEffect, useState } from 'react';
import { V1LimitRangeList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { LimitRangeList } from '@components/configuration/limit-range/table';
import { Button } from '@protoku-bv/design-system';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const LimitRangesListView = (): JSX.Element => {
  const [limitRanges, setLimitRanges] = useState<V1LimitRangeList>();
  const [error, setError] = useState<string | null>(null);
  const { setViewContext } = useView();

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listLimitRangeForAllNamespaces();

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
      <ListHeader 
        resource={Resources.LimitRanges} 
        error={error}
        showNamespaceDropdown={true}
        actions={
          <Button variant="primary"
            onClick={() => setViewContext({resource: Resources.LimitRanges, action: ResourceAction.Create})} 
          >
            Create Limit Range
          </Button>
        }
      />
      {limitRanges && <LimitRangeList limitRanges={limitRanges} />}
    </>
  );
};