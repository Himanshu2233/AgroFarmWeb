import { useState, useRef, useCallback } from 'react';
import ConfirmDialog from './ConfirmDialog';
import { ConfirmContext } from './ConfirmContext';

export function ConfirmProvider({ children }) {
  const [state, setState] = useState({ isOpen: false, config: {} });
  const resolveRef = useRef(null);

  const confirm = useCallback((config = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setState({ isOpen: true, config });
    });
  }, []);

  const handleConfirm = (value) => {
    setState({ isOpen: false, config: {} });
    resolveRef.current?.(value);
  };

  const handleCancel = () => {
    setState({ isOpen: false, config: {} });
    resolveRef.current?.(false);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmDialog
        isOpen={state.isOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        {...state.config}
      />
    </ConfirmContext.Provider>
  );
}
