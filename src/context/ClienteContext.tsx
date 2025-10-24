import React, { createContext, useContext, useEffect, useState } from 'react';

interface Cliente {
  id?: string;
  nome: string;
  telefone: string;
}

interface ClienteContextType {
  cliente: Cliente | null;
  saveCliente: (c: Cliente) => void;
  logoutCliente: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const ClienteContext = createContext<ClienteContextType | undefined>(undefined);

export function ClienteProvider({ children }: { children: React.ReactNode }) {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cliente');
      if (raw) setCliente(JSON.parse(raw));
    } catch {
      localStorage.removeItem('cliente');
    } finally {
      setLoading(false);
    }
  }, []);

  function saveCliente(c: Cliente) {
    setCliente(c);
    try {
      localStorage.setItem('cliente', JSON.stringify(c));
    } catch (err) {
      console.warn(
        'ClienteContext: falha ao salvar cliente no localStorage',
        err
      );
    }
  }

  function logoutCliente() {
    setCliente(null);
    try {
      localStorage.removeItem('cliente');
    } catch (err) {
      console.warn(
        'ClienteContext: falha ao remover cliente do localStorage',
        err
      );
    }
  }

  return (
    <ClienteContext.Provider
      value={{
        cliente,
        saveCliente,
        logoutCliente,
        isAuthenticated: !!cliente,
        loading,
      }}
    >
      {children}
    </ClienteContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCliente() {
  const ctx = useContext(ClienteContext);
  if (!ctx) throw new Error('useCliente must be used within ClienteProvider');
  return ctx;
}
