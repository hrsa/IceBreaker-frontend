// src/hooks/useAlert.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CustomAlert } from '@/components/CustomAlert';

type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

type AlertContextType = {
  alert: (title: string, message: string, buttons?: AlertButton[]) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    buttons: [{ text: 'OK' }] as AlertButton[],
  });

  const alert = (title: string, message: string, buttons?: AlertButton[]) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      buttons: buttons || [{ text: 'OK' }],
    });
  };

  const hideAlert = () => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  };

  return (
    <AlertContext.Provider value={{ alert }}>
  {children}
  <CustomAlert
    visible={alertConfig.visible}
  title={alertConfig.title}
  message={alertConfig.message}
  buttons={alertConfig.buttons}
  onDismiss={hideAlert}
  />
  </AlertContext.Provider>
);
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};