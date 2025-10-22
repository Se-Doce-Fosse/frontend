import { useLocation, useNavigate } from 'react-router-dom';
import styles from './SideBar.module.scss';
import { GoGraph } from 'react-icons/go';
import { IoSettingsOutline } from 'react-icons/io5';
import {
  AiOutlineComment,
  AiOutlineShop,
  AiOutlineShoppingCart,
  AiOutlineTags,
  AiOutlinePercentage,
} from 'react-icons/ai';
import { FaSignOutAlt } from 'react-icons/fa';
import logoImage from '../../assets/images/logo-se-doce-fosse.png';
import { useUser } from '../../context/UserContext';

export default function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useUser();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navBarItems = [
    {
      icon: <GoGraph size={24} />,
      label: 'Dashboard',
      path: '/admin/dashboard',
    },
    {
      icon: <AiOutlineShop size={24} />,
      label: 'Estoque',
      path: '/admin/estoque',
    },
    {
      icon: <AiOutlineTags size={24} />,
      label: 'Produtos',
      path: '/admin/produtos',
    },
    {
      icon: <AiOutlineShoppingCart size={24} />,
      label: 'Pedidos',
      path: '/admin/pedidos',
    },
    {
      icon: <AiOutlineComment size={24} />,
      label: 'Comentários',
      path: '/admin/comentarios',
    },
    {
      icon: <IoSettingsOutline size={24} />,
      label: 'Configurações',
      path: '/admin/configuracoes',
    },
    {
      icon: <AiOutlinePercentage size={24} />,
      label: 'Cupons',
      path: '/admin/cupons',
    },
  ];

  return (
    <nav className={styles.navBar}>
      <div className={styles.navHeader}>
        <div className={styles.navLogo}>
          <img
            src={logoImage}
            alt="Se Doce Fosse"
            className={styles.logoImage}
          />
        </div>
      </div>

      <ul className={styles.navList}>
        {navBarItems.map((item, index) => (
          <li
            key={index}
            className={`${styles.navItem} ${
              location.pathname === item.path ? styles.active : ''
            }`}
            onClick={() => handleNavigation(item.path)}
          >
            <div className={styles.navIcon}>{item.icon}</div>
            <span className={styles.navLabel}>{item.label}</span>
          </li>
        ))}
      </ul>

      <div className={styles.navFooter}>
        <div className={styles.adminInfo}>
          <div className={styles.adminAvatar}>
            <span className={styles.avatarText}>C</span>
          </div>
          <div className={styles.adminDetails}>
            <span className={styles.adminName}>Administrador</span>
            <span className={styles.adminEmail}>@carolina.padilha</span>
          </div>
        </div>
        <button
          className={styles.logoutButton}
          onClick={handleLogout}
          title="Sair"
        >
          <FaSignOutAlt size={18} />
        </button>
      </div>
    </nav>
  );
}
