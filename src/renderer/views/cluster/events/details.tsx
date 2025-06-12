import { useEffect, useState } from 'react';
import k8s from '@kubernetes/client-node';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs } from "@utils/enums";
import { DetailsItem } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { Heading, Subheading } from '@components/base/heading';
import { MetadataDetails } from '@components/metadata';
import { EventBadge } from '@components/cluster/event/badge';
import { calculateAge } from '@utils/helpers';

export const EventsDetailsView = (): JSX.Element => {
    const { viewContext } = useView()
    const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
    const [event, setEvent] = useState<k8s.CoreV1Event>();
    const [error, setError] = useState<string | null>(null);
  
    const fetchData = async () => {
      try {
        const data = await window.electronAPI.readNamespacedEvent(viewContext.name, viewContext.namespace);
        setEvent(data);
        setError(null);
      } catch (e) {
        console.error("Failed to fetch Event data:", e);
        setError("Failed to fetch Event data.");
      }
    };
  
    useEffect(() => {
      fetchData();
      const intervalId = setInterval(fetchData, 5000);
      return () => clearInterval(intervalId);
    }, []);
  
    const yamlContent = dump(event);
  
    return (
      <>
        <DetailsHeader error={error}>
          <Heading>
            <EventBadge />{viewContext.name}
          </Heading>
          
          <Navbar>
            <NavbarSection>
              <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab === ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
              <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab === ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
            </NavbarSection>
          </Navbar>
        </DetailsHeader>
  
        {activeTab === ResourceTabs.Details && event && (
          <div className='m-2 flex flex-col gap-8'>
            <MetadataDetails metadata={event.metadata} />
            
            <div>
              <Subheading>Event Information</Subheading>
              <div className='mt-4'>
                <DetailsItem label="Type">
                  <span className={event.type === 'Warning' ? 'text-red-600' : 'text-green-600'}>
                    {event.type || 'Unknown'}
                  </span>
                </DetailsItem>
                <DetailsItem label="Reason">
                  {event.reason || 'Not specified'}
                </DetailsItem>
                <DetailsItem label="Message">
                  {event.message || 'No message'}
                </DetailsItem>
                <DetailsItem label="Count">
                  {event.count || 1}
                </DetailsItem>
                <DetailsItem label="First Seen">
                  {event.firstTimestamp ? calculateAge(new Date(event.firstTimestamp)) : 'Unknown'}
                </DetailsItem>
                <DetailsItem label="Last Seen">
                  {event.lastTimestamp ? calculateAge(new Date(event.lastTimestamp)) : 'Unknown'}
                </DetailsItem>
              </div>
            </div>

            {event.involvedObject && (
              <div>
                <Subheading>Involved Object</Subheading>
                <div className='mt-4'>
                  <DetailsItem label="Kind">
                    {event.involvedObject.kind || 'Unknown'}
                  </DetailsItem>
                  <DetailsItem label="Name">
                    {event.involvedObject.name || 'Unknown'}
                  </DetailsItem>
                  <DetailsItem label="Namespace">
                    {event.involvedObject.namespace || 'N/A'}
                  </DetailsItem>
                  {event.involvedObject.fieldPath && (
                    <DetailsItem label="Field Path">
                      {event.involvedObject.fieldPath}
                    </DetailsItem>
                  )}
                </div>
              </div>
            )}

            {event.source && (
              <div>
                <Subheading>Source</Subheading>
                <div className='mt-4'>
                  <DetailsItem label="Component">
                    {event.source.component || 'Unknown'}
                  </DetailsItem>
                  {event.source.host && (
                    <DetailsItem label="Host">
                      {event.source.host}
                    </DetailsItem>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
  
        {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
      </>
    );
}

export default EventsDetailsView;