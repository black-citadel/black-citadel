import { useState } from "react"
import { NamespaceResourceLink } from "./cluster/namespace/resource-link"
import helpObjects from "@help/index"
import { HelpObject } from "@help/types"
import { HelpButton } from "./help-button"

interface DetailsItemProps {
  label: string
  help?: HelpObject
  children: React.ReactNode
}

export const DetailsItem = ({ label, help, children }: DetailsItemProps): JSX.Element => {
  return (
    <div className="">
      <dt className="text-xs leading-6 text-neutral-400 uppercase tracking-wider">{label}</dt>
      <dd className="mt-1 text-sm leading-6 text-white sm:mt-2 mb-6">{children}</dd>
    </div>
  )
}

interface DetailsNameProps {
  name: string
}

export const DetailsName = ({ name }: DetailsNameProps): JSX.Element => {
  return (
    <DetailsItem label="Name">{name}</DetailsItem>
  )
}

interface DetailsNamespaceProps {
  name: string
}

export const DetailsNamespace = ({ name }: DetailsNamespaceProps): JSX.Element => {
  return (
    <DetailsItem label="Namespace">
      <NamespaceResourceLink name={name} />
    </DetailsItem>
  )
}

interface DetailsLabelsProps {
  labels?: {
    [key: string]: string;
  };
}

export const DetailsLabels = ({ labels }: DetailsLabelsProps): JSX.Element => {
  return (
    <DetailsItem label="Labels">
      {labels && (
        <>
          {Object.entries(labels).map(([key, value]) => (
            <div key={key}>
              <span className="bg-zinc-800 py-0.5 px-2 mb-2 rounded text-xs">
                {key}: {value}
              </span>
            </div>
          ))}
        </>
      )}

    </DetailsItem>
  )
}

interface DetailsSelectorProps {
  labels?: {
    [key: string]: string;
  };
}

export const DetailsSelector = ({ labels }: DetailsSelectorProps): JSX.Element => {
  return (
    <DetailsItem label="Selector" help={helpObjects.service.selector}>
      {labels && (
        <>
          {Object.entries(labels).map(([key, value]) => (
            <div key={key}>
              <span className="bg-neutral-900 py-0.5 px-2 mb-2 rounded text-xs">
                {key}: {value}
              </span>
            </div>
          ))}
        </>
      )}

    </DetailsItem>
  )
}

interface DetailsAnnotationsProps {
  annotations?: {
    [key: string]: string;
  };
}

export const DetailsAnnotations = ({ annotations }: DetailsAnnotationsProps): JSX.Element => {
  const [expandedAnnotations, setExpandedAnnotations] = useState<Record<string, boolean>>({});

  const toggleExpand = (key: string) => {
    setExpandedAnnotations(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const MAX_LENGTH = 100; 

  const renderAnnotationValue = (key: string, value: string) => {
    if (value.length <= MAX_LENGTH) {
      return <span className="py-0.5 px-2 mb-2 text-xs">{value}</span>;
    }

    const isExpanded = expandedAnnotations[key];
    const displayValue = isExpanded ? value : value.slice(0, MAX_LENGTH) + '...';

    return (
      <div className="flex flex-col">
        <span className="mb-2 text-xs">{displayValue}</span>
        <button 
          onClick={() => toggleExpand(key)}
          className="text-blue-600 text-xs focus:outline-none"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      </div>
    );
  };

  return (
    <>
      {annotations && (
        <>
          {Object.entries(annotations)
            .filter(([key]) => key !== 'kubectl.kubernetes.io/last-applied-configuration')
            .map(([key, value]) => (
              <div key={key} className="mb-2">
                <span className="bg-neutral-900 py-0.5 px-2 rounded text-xs">
                  {key}:
                </span>
                {renderAnnotationValue(key, value)}
              </div>
            ))}
        </>
      )}
    </>
  )
}