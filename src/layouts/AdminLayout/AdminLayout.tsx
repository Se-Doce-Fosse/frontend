import { SideBar, ProtectedRoute } from '@components';
import styles from './AdminLayout.module.scss';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className={`${styles.layout} ${styles.hasMobileHeader}`}>
        <SideBar />
        <main className={styles.content}>{children}</main>
      </div>
    </ProtectedRoute>
  );
}
