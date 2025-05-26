import React, { createContext, useContext } from 'react';
import { useClientUUID } from '@/hooks/useClientUUID';

interface UUIDContextValue {
  uuid: string | null;
  removeUUID: () => void;
}

const UUIDContext = createContext<UUIDContextValue | undefined>(undefined);

export const UUIDProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { uuid, removeUUID } = useClientUUID();

  return (
    <UUIDContext.Provider value={{ uuid, removeUUID }}>
      {children}
    </UUIDContext.Provider>
  );
};

export const useUUID = (): UUIDContextValue => {
  const context = useContext(UUIDContext);
  if (!context) {
    throw new Error('useUUID must be used within a UUIDProvider');
  }
  return context;
};
