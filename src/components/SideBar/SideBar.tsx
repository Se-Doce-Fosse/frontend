import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
import { FaBars, FaTimes } from 'react-icons/fa';
import logoImage from '../../assets/images/logo-se-doce-fosse.png';
import { useUser } from '../../context/UserContext';

export default function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
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

  const roleLabels: Record<string, string> = {
    ROLE_OWNER: 'Proprietário',
    ROLE_MANAGER: 'Gerente',
    ROLE_USER: 'Usuário',
  };

  const displayName = user?.name || user?.email || 'Administrador';
  const displayRole = (user?.role && roleLabels[user.role]) || 'Administrador';
  const avatarLetter =
    displayName?.charAt(0)?.toUpperCase() ||
    displayEmail.charAt(0)?.toUpperCase() ||
    'A';

  return (
    <>
      <div className={styles.mobileHeader}>
        <button
          type="button"
          className={styles.mobileLogoWrapper}
          onClick={() => navigate('/admin/dashboard')}
          aria-label="Ir para o Dashboard"
        >
          <img
            src={logoImage}
            alt="Se Doce Fosse"
            className={styles.mobileLogoImage}
          />
        </button>

        <button
          type="button"
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          aria-controls="admin-mobile-menu"
          aria-pressed={menuOpen}
        >
          {menuOpen ? (
            <FaTimes size={25} color="#743014" />
          ) : (
            <FaBars size={25} color="#743014" />
          )}
        </button>
      </div>

      <nav
        id="admin-mobile-menu"
        className={`${styles.navBar} ${styles.mobileMenu} ${menuOpen ? styles.isOpen : ''}`}
      >
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
              <span className={styles.avatarText}>{avatarLetter}</span>
            </div>
            <div className={styles.adminDetails}>
              <span className={styles.adminName}>{displayRole}</span>
              {displayName && (
                <span className={styles.adminEmail}>{displayName}</span>
              )}
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

      <button
        type="button"
        className={`${styles.backdrop} ${menuOpen ? styles.backdropVisible : ''}`}
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
      />
    </>
  );
}
