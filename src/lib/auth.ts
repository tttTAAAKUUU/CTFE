export const setToken = (token: string) => {
  localStorage.setItem('access_token', token);
};

export const clearToken = () => {
  localStorage.removeItem('access_token');
};

export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
};
