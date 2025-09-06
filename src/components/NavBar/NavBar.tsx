import { useState } from 'react';
import styles from './Navbar.module.scss';
import { FaUser, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import logoImage from '../../assets/logo-se-doce-fosse-dark.png';

interface NavLink {
  label: string;
  href: string;
}

export interface NavbarProps {
  onCartClick?: () => void;
  onLoginClick?: () => void;
  links?: NavLink[];
  isLoginActive?: boolean;
  isCartDrawerActive?: boolean;
}

const defaultLinks: NavLink[] = [
  { label: 'Produtos', href: '/produtos' },
  { label: 'Encomendas', href: '/encomendas' },
  { label: 'Sobre Nós', href: '/sobre-nos' },
];

export function Navbar({
  onCartClick,
  onLoginClick,
  links = defaultLinks,
  isLoginActive = false,
  isCartDrawerActive = false,
}: NavbarProps) {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
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
            className={`${styles.iconButton} ${isLoginActive ? styles.active : ''}`}
          >
            <FaUser />
            <span>Entrar</span>
          </button>
          <button
            onClick={onCartClick}
            className={`${styles.iconButton} ${isCartDrawerActive ? styles.active : ''}`}
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
          <li className={styles.mobileActionItem}>
            <button
              onClick={() => {
                onLoginClick?.();
                setMenuOpen(false);
              }}
              className={`${styles.iconButton} ${isLoginActive ? styles.active : ''}`}
            >
              <FaUser />
              <span>Entrar</span>
            </button>
          </li>
          <li className={styles.mobileActionItem}>
            <button
              onClick={() => {
                onCartClick?.();
                setMenuOpen(false);
              }}
              className={`${styles.iconButton} ${isCartDrawerActive ? styles.active : ''}`}
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
