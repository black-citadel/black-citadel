import { ReactNode } from 'react';

export interface HelpObject {
  help: ReactNode;
}

export type HelpObjectMap = Record<string, HelpObject>;