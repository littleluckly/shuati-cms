import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, logout as apiLogout } from '../api/auth';

interface UserInfo {
  id: string;
  username: string;
  role: string;
  // 其他用户信息字段
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // 初始时，如果有localStorage中的token，则假设用户已认证，等待验证
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  // 从localStorage加载认证信息
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  // 确保isAuthenticated状态与token和user状态保持同步
  useEffect(() => {
    // 只有在加载完成后才更新认证状态
    if (!loading) {
      setIsAuthenticated(!!token && !!user);
    }
  }, [token, user, loading]);

  // 登录方法
  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await apiLogin(username, password);
      console.log('Login response:', response);
      const { token: newToken } = response;

      // 构建符合UserInfo接口的用户对象
      const newUser: UserInfo = {
        id: response.userId,
        username: response.username,
        role: response.role
      };

      // 保存token和用户信息到localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      console.log('newToken', newToken);
      // 更新状态
      setToken(newToken);
      setUser(newUser);
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [apiLogin]);

  // 登出方法
  const logout = useCallback(() => {
    apiLogout().catch((error) => {
      console.error('Logout API failed:', error);
    });

    // 清除localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // 更新状态
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    // 延迟跳转到登录页，确保状态更新完成
    setTimeout(() => {
      navigate('/login', { replace: true });
    }, 0);
  }, [navigate, apiLogout]);

  // 刷新Token方法
  const refreshToken = useCallback(async (): Promise<void> => {
    try {
      // 获取当前token
      const currentToken = localStorage.getItem('token');
      if (!currentToken) {
        throw new Error('No token available');
      }
      
      // 调用刷新Token的API
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Token refresh failed');
      }
      
      const data = await response.json();
      const { token: newToken } = data;
      
      if (!newToken) {
        throw new Error('No new token received');
      }
      
      // 更新localStorage中的token
      localStorage.setItem('token', newToken);
      // 更新状态中的token
      setToken(newToken);
    } catch (error) {
      console.error('Token refresh failed:', error);
      // 刷新失败，强制登出
      logout();
    }
  }, [logout]);

  // 定期刷新Token
  useEffect(() => {
    if (!token) return;

    const refreshInterval = setInterval(() => {
      refreshToken().catch(error => {
        console.error('Token refresh interval error:', error);
      });
    }, 30 * 60 * 1000); // 每30分钟刷新一次

    return () => clearInterval(refreshInterval);
  }, [token, refreshToken]);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    token,
    loading,
    login,
    logout,
    refreshToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};