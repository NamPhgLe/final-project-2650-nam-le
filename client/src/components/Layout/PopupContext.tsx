import React, { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';

interface PopupContextType {
  message: string;
  show: boolean;
  showPopup: (msg: string) => void;
}

const PopupContext = createContext<PopupContextType>({
  message: '',
  show: false,
  showPopup: () => {},
});

export const usePopup = () => useContext(PopupContext);

export const PopupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');

  const showPopup = (msg: string) => {
    setMessage(msg);
    setShow(true);
    setTimeout(() => setShow(false), 3000);
  };

  return (
    <PopupContext.Provider value={{ message, show, showPopup }}>
      {children}
    </PopupContext.Provider>
  );
};
