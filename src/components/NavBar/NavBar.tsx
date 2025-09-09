import { useState } from 'react';
import styles from './NavBar.module.scss';
import { FaUser, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import logoImage from '@/assets/logo-se-doce-fosse-dark.png';

interface NavLink {
  label: string;
  href: string;
}

export interface NavBarProps {
  onCartClick?: () => void;
  onLoginClick?: () => void;
  links?: NavLink[];
  isLoginModalActive?: boolean;
  isCartDrawerActive?: boolean;
}

const defaultLinks: NavLink[] = [
  { label: 'Produtos', href: '/produtos' },
  { label: 'Encomendas', href: '/encomendas' },
  { label: 'Sobre Nós', href: '/sobre-nos' },
];

export function NavBar({
  onCartClick,
  onLoginClick,
  links = defaultLinks,
  isLoginModalActive = false,
  isCartDrawerActive = false,
}: NavBarProps) {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleMobileLinkClick = (action?: () => void) => {
    if (action) {
      action();
    }
    setMenuOpen(false);
  };

  return (
    <nav className={styles.NavBar}>
      <div className={styles.NavBarContainer}>
        <a
          href="/"
          className={styles.logoLink}
          aria-label="Página inicial Se Doce Fosse"
        >
          <img
            src={logoImage}
            alt="Se Doce Fosse - Logotipo"
            className={styles.logoImage}
          />
        </a>
        <ul className={styles.navLinks}>
          {links.map((link) => (
            <li key={link.label}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
        <div className={styles.navIcons}>
          <button
            onClick={onLoginClick}
            className={`${styles.iconButton} ${
              isLoginModalActive ? styles.active : ''
            }`}
          >
            <FaUser />
            <span>Entrar</span>
          </button>
          <button
            onClick={onCartClick}
            className={`${styles.iconButton} ${
              isCartDrawerActive ? styles.active : ''
            }`}
          >
            <FaShoppingCart />
            <span>Carrinho</span>
          </button>
        </div>
        <div
          className={styles.hamburger}
          onClick={toggleMenu}
          role="button"
          aria-label="Abrir ou fechar menu de navegação"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && toggleMenu()}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
      {isMenuOpen && (
        <ul className={styles.mobileMenu}>
          {links.map((link) => (
            <li key={link.label}>
              <a href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
          <li className={styles.mobileActionsSeparator} />
          <li className={styles.mobileActionItem}>
            <button
              onClick={() => handleMobileLinkClick(onLoginClick)}
              className={`${styles.iconButton} ${
                isLoginModalActive ? styles.active : ''
              }`}
            >
              <FaUser />
              <span>Entrar</span>
            </button>
          </li>
          <li className={styles.mobileActionItem}>
            <button
              onClick={() => handleMobileLinkClick(onCartClick)}
              className={`${styles.iconButton} ${
                isCartDrawerActive ? styles.active : ''
              }`}
            >
              <FaShoppingCart />
              <span>Carrinho</span>
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
}
