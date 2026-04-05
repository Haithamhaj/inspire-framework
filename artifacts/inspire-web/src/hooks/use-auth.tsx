import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useGetMe, useRefreshToken, useLogout } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

// Module-level token for the fetch interceptor (no React re-render needed here)
let _memoryToken: string | null = null;

export const getMemoryToken = () => _memoryToken;

const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const [resource, config] = args;
  if (typeof resource === "string" && resource.startsWith("/api/") && _memoryToken) {
    const newConfig = { ...(config || {}) };
    newConfig.headers = {
      ...newConfig.headers,
      Authorization: `Bearer ${_memoryToken}`,
    };
    return originalFetch(resource, newConfig);
  }
  return originalFetch(...args);
};

interface AuthContextType {
  user: unknown | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isInitializing, setIsInitializing] = useState(true);
  // React state token — triggers re-renders so enabled/isLoading are accurate
  const [token, setToken] = useState<string | null>(null);
  const { mutateAsync: performRefresh } = useRefreshToken();
  const { mutateAsync: performLogout } = useLogout();
  const queryClient = useQueryClient();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    performRefresh({})
      .then((res) => {
        if (res.success && res.access_token) {
          _memoryToken = res.access_token;
          if (isMounted.current) setToken(res.access_token);
        }
      })
      .catch(() => {
        _memoryToken = null;
        if (isMounted.current) setToken(null);
      })
      .finally(() => {
        if (isMounted.current) setIsInitializing(false);
      });
    return () => {
      isMounted.current = false;
    };
  }, [performRefresh]);

  const { data: meData, isLoading: isMeLoading, isFetching: isMeFetching } = useGetMe({
    query: {
      enabled: !isInitializing && !!token,
      retry: false,
    },
  });

  const login = (newToken: string) => {
    _memoryToken = newToken;
    setToken(newToken); // triggers re-render → enabled becomes true → query fires
    queryClient.resetQueries({ queryKey: ["/api/auth/me"] });
  };

  const logout = async () => {
    try {
      await performLogout();
    } finally {
      _memoryToken = null;
      setToken(null);
      queryClient.setQueryData(["/api/auth/me"], null);
      queryClient.invalidateQueries();
    }
  };

  const isLoading = isInitializing || (!!token && (isMeLoading || isMeFetching));
  const user = meData?.success ? meData.user : null;

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
