import Pusher from 'pusher-js';
import React, { createContext, FC } from 'react';

// const pusher = new Pusher('00806514f90cf476dcd8', {
//   cluster: 'ap1',
// });

// export default pusher

// export const PusherContext = createContext(pusher)

export const PusherContext = createContext<Pusher | null>(null);

interface PusherProviderProps {
  children: React.ReactNode;
}

export const PusherProvider: FC<PusherProviderProps> = ({ children }) => {
  const pusher = new Pusher('00806514f90cf476dcd8', {
    cluster: 'ap1',
  });

  return (
    <PusherContext.Provider value={pusher}>
      {children}
    </PusherContext.Provider>
  );
};
