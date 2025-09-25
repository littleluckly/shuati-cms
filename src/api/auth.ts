import request, { post } from '../utils/request';

interface LoginResponse {
  userId: string;
  username: string;
  role: string;
  token: string;
  lastLogin?: string;
  email?: string;
  // 其他用户信息字段
}

/**
 * 用户登录
 * @param username 用户名
 * @param password 密码
 * @returns 登录响应数据，包含token和用户信息
 */
export const login = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    // 使用实际API，根据响应拦截器的逻辑，response已经是data.data
    // 使用实际API，使用封装的post函数并指定泛型类型
    return await post<LoginResponse>('/users/login', {
      username,
      password
    });
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
};

/**
 * 用户登出
 * @returns 登出响应
 */
export const logout = async (): Promise<void> => {
  try {
    // 从localStorage获取token和user信息
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    let userId = '';
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        userId = user.id || '';
      } catch (parseError) {
        console.error('Failed to parse user data:', parseError);
      }
    }
    
    // 调用登出API并传递必要参数
    await request.post('/users/logout', {
      userId,
      token
    });
    
    // 清除localStorage中的认证信息
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Logout API error:', error);
    // 即使API调用失败，也清除本地存储
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

/**
 * 获取当前登录用户信息
 * @returns 当前用户信息
 */
export const getCurrentUser = async (): Promise<any> => {
  try {
    // 使用实际API
    const response = await request.get('/auth/me');
    return response;
  } catch (error) {
    console.error('Get current user API error:', error);
    throw error;
  }
};