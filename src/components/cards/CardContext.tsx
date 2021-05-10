import React, { useContext, createContext, ReactNode } from 'react';
import { useRafState } from 'react-use';

interface CardContextProps {
  isHovered: boolean;
  setIsHovered: (arg0: boolean) => void;
}

const CardContext = createContext<Partial<CardContextProps>>({
  isHovered: false,
  setIsHovered: () => void 0,
});

export function useCardContext() {
  return useContext(CardContext);
}

interface ContextProviderProps {
  children: ReactNode;
}

export default function CardContextProvider(
  props: ContextProviderProps
): JSX.Element {
  const { children } = props;
  const [isHovered, setIsHovered] = useRafState<boolean>(false);

  return (
    <CardContext.Provider
      value={{
        isHovered,
        setIsHovered,
      }}
    >
      {children}
    </CardContext.Provider>
  );
}
