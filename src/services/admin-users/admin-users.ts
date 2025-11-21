import { api } from '..';

export type AdminUserRole = 'ROLE_OWNER' | 'ROLE_MANAGER' | 'ROLE_USER';

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: AdminUserRole;
}

export const fetchAdminUsers = async (token: string): Promise<AdminUser[]> => {
  return api(
    '/admin/users',
    { Authorization: `Bearer ${token}` },
    { method: 'GET' }
  );
};

export const updateAdminUser = async (
  userId: number,
  token: string,
  payload: {
    username: string;
    email: string;
    role: AdminUserRole;
    password?: string;
  }
) => {
  return api(
    `/admin/users/${userId}`,
    {
      Authorization: `Bearer ${token}`,
    },
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    }
  );
};

export const deleteAdminUser = async (userId: number, token: string) => {
  return api(
    `/admin/users/${userId}`,
    { Authorization: `Bearer ${token}` },
    { method: 'DELETE' }
  );
};
