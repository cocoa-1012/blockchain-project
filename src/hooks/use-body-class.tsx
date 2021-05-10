import { useEffect } from 'react';

export default function useBodyClass(className: string): null {
  useEffect(() => {
    document.body.classList.add(className);
    return () => {
      document.body.classList.remove(className);
    };
  }, [className]);
  return null;
}
