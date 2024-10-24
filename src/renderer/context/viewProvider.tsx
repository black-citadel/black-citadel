import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Resources, ResourceAction } from '../utils/enums';

interface ViewContext {
  resource: Resources,
  action: ResourceAction,
  name?: string,
  namespace?: string
}

type ViewContextType = {
  viewContext: ViewContext;
  setViewContext: (context: ViewContext) => void;
  activeNamespace: string;
  setActiveNamespace: (namespace: string) => void;
  activeContext: string;
  setActiveContext: (context: string) => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  helpTitle: string;
  setHelpTitle: (title: string) => void;
  helpContent: React.ReactNode;
  setHelpContent: (content: React.ReactNode) => void;
};

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export const ViewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [viewContext, setViewContext] = useState({resource: Resources.Contexts, action: ResourceAction.List});
  const [activeNamespace, setActiveNamespace] = useState("all");
  const [activeContext, setActiveContext] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [helpTitle, setHelpTitle] = useState("");
  const [helpContent, setHelpContent] = useState<React.ReactNode>(<></>);

  return (
    <ViewContext.Provider value={{
      viewContext, setViewContext,
      activeNamespace, setActiveNamespace,
      activeContext, setActiveContext,
      drawerOpen, setDrawerOpen,
      helpTitle, setHelpTitle,
      helpContent, setHelpContent
    }}>
      {children}
    </ViewContext.Provider>
  );
};

export const useView = (): ViewContextType => {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
};

