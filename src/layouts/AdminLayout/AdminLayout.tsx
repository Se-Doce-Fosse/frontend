import { SideBar } from '@components';
import styles from './AdminLayout.module.scss';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layout}>
      <SideBar />
      <main className={styles.content}>{children}</main>
    </div>
  );
}
