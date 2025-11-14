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
