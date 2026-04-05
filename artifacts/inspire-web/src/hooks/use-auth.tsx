import React, { createContext, useContext, useState, useEffect } from "react";
import { useGetMe, useRefreshToken, useLogout } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

// Interceptor to inject bearer token into all fetch requests made to /api
let memoryToken: string | null = null;

export const setMemoryToken = (token: string | null) => {
  memoryToken = token;
};

const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const [resource, config] = args;
  if (typeof resource === "string" && resource.startsWith("/api/") && memoryToken) {
    const newConfig = config || {};
    newConfig.headers = {
      ...newConfig.headers,
      Authorization: `Bearer ${memoryToken}`,
    };
    return originalFetch(resource, newConfig);
  }
  return originalFetch(...args);
};

interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isInitializing, setIsInitializing] = useState(true);
  const { mutateAsync: performRefresh } = useRefreshToken();
  const { mutateAsync: performLogout } = useLogout();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Attempt to silently refresh token on app load using the HttpOnly cookie
    performRefresh({})
      .then((res) => {
        if (res.success && res.access_token) {
          setMemoryToken(res.access_token);
        }
      })
      .catch(() => {
        setMemoryToken(null);
      })
      .finally(() => {
        setIsInitializing(false);
      });
  }, [performRefresh]);

  const { data: meData, isLoading: isMeLoading, isFetching: isMeFetching } = useGetMe({
    query: {
      enabled: !isInitializing && !!memoryToken,
      retry: false,
    },
  });

  const login = (token: string) => {
    setMemoryToken(token);
    // Reset (clear cache) so pages see isLoading=true while fetching the
    // fresh user, preventing a stale null from causing premature redirects.
    queryClient.resetQueries({ queryKey: ["/api/auth/me"] });
  };

  const logout = async () => {
    try {
      await performLogout();
    } finally {
      setMemoryToken(null);
      queryClient.setQueryData(["/api/auth/me"], null);
      queryClient.invalidateQueries();
    }
  };

  const isLoading = isInitializing || (!!memoryToken && (isMeLoading || isMeFetching));
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
