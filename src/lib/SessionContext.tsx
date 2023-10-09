import { createContext, useContext, ReactNode } from "react";
import SessionState from "./SessionState";

interface SessionContextType {
  session: SessionState;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionContextProviderProps {
  session: SessionState;
  children: ReactNode;
}

export const SessionContextProvider = (
  { session, children }: SessionContextProviderProps) => {
  return (
    <SessionContext.Provider value={{
      session: session
    }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessionContext must be used within a SessionContextProvider");
  }
  return context;
};
