import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
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
  canGoBack: boolean;
  canGoForward: boolean;
  goBack: () => void;
  goForward: () => void;
};

const ViewContext = createContext<ViewContextType | undefined>(undefined);

const MAX_HISTORY_SIZE = 50;

export const ViewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const initialView = {resource: Resources.Contexts, action: ResourceAction.List};
  const [viewContext, setViewContextState] = useState<ViewContext>(initialView);
  const [activeNamespace, setActiveNamespace] = useState("all");
  const [activeContext, setActiveContext] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [helpTitle, setHelpTitle] = useState("");
  const [helpContent, setHelpContent] = useState<React.ReactNode>(<></>);
  
  const [history, setHistory] = useState<ViewContext[]>([initialView]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const setViewContext = useCallback((context: ViewContext) => {
    setViewContextState(context);
    
    setHistory(prev => {
      const newHistory = [...prev.slice(0, historyIndex + 1), context];
      if (newHistory.length > MAX_HISTORY_SIZE) {
        return newHistory.slice(-MAX_HISTORY_SIZE);
      }
      return newHistory;
    });
    
    setHistoryIndex(prev => Math.min(prev + 1, MAX_HISTORY_SIZE - 1));
  }, [historyIndex]);

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setViewContextState(history[newIndex]);
    }
  }, [historyIndex, history]);

  const goForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setViewContextState(history[newIndex]);
    }
  }, [historyIndex, history]);

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  useEffect(() => {
    const handleNavigation = (event: MessageEvent) => {
      if (event.data.type === 'navigation') {
        if (event.data.direction === 'back') {
          goBack();
        } else if (event.data.direction === 'forward') {
          goForward();
        }
      }
    };

    window.addEventListener('message', handleNavigation);
    return () => window.removeEventListener('message', handleNavigation);
  }, [goBack, goForward]);

  return (
    <ViewContext.Provider value={{
      viewContext, setViewContext,
      activeNamespace, setActiveNamespace,
      activeContext, setActiveContext,
      drawerOpen, setDrawerOpen,
      helpTitle, setHelpTitle,
      helpContent, setHelpContent,
      canGoBack, canGoForward,
      goBack, goForward
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

