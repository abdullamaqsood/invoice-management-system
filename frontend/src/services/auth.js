export const login = async (username, password) => {
  const res = await fetch('https://invoice-management-system-production-40bc.up.railway.app/api/auth/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error('Login failed');
  const data = await res.json();

  const userRes = await fetch('https://invoice-management-system-production-40bc.up.railway.app/api/users/', {
    headers: { Authorization: `Bearer ${data.access}` },
  });
  const users = await userRes.json();
  const user = users.find((u) => u.username === username);

  localStorage.setItem('token', data.access);
  localStorage.setItem('user', JSON.stringify(user)); // 👈 store role here
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = () => !!localStorage.getItem('token');

export const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.role || '';
};
