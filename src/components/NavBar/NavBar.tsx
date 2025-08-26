import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './NavBar.module.scss';
import { GoGraph } from 'react-icons/go';
import { IoSettingsOutline } from 'react-icons/io5';
import {
  AiOutlineComment,
  AiOutlineShop,
  AiOutlineShoppingCart,
  AiOutlineTags,
} from 'react-icons/ai';
import { FaBars, FaSignOutAlt } from 'react-icons/fa';
import { BiUser } from 'react-icons/bi';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleNavigation = (path: string) => {
    console.log('Navegando para:', path);
    navigate(path);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    console.log('Toggle NavBar:', !isExpanded);
  };

  const navBarItems = [
    {
      icon: <GoGraph size={24} />,
      label: 'Dashboard',
      path: '/dashboard',
    },
    {
      icon: <AiOutlineShop size={24} />,
      label: 'Estoque',
      path: '/estoque',
    },
    {
      icon: <AiOutlineTags size={24} />,
      label: 'Produtos',
      path: '/produtos',
    },
    {
      icon: <AiOutlineShoppingCart size={24} />,
      label: 'Pedidos',
      path: '/pedidos',
    },
    {
      icon: <AiOutlineComment size={24} />,
      label: 'Comentários',
      path: '/comentarios',
    },
    {
      icon: <IoSettingsOutline size={24} />,
      label: 'Configurações',
      path: '/configuracoes',
    },
  ];

  const navBarStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    height: '100vh',
    backgroundColor: '#e8d1a7',
    transition: 'width 0.3s ease',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column' as const,
    width: isExpanded ? '280px' : isHovered ? '280px' : '70px',
    color: '#743014',
    fontFamily: 'Arial, sans-serif',
    boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
  };

  return (
    <nav
      style={navBarStyle}
      className={`${styles.navBar} ${isExpanded ? styles.expanded : styles.collapsed}`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => !isExpanded && setIsHovered(false)}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem',
          paddingLeft: '2rem',
          minHeight: '60px',
        }}
      >
        {isExpanded ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span
                style={{
                  fontFamily: 'Times New Roman, serif',
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#743014',
                }}
              >
                Se Doce Fosse
              </span>
            </div>
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#743014',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
              }}
              onClick={toggleExpand}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'rgba(116, 48, 20, 0.1)';
                e.currentTarget.style.borderRadius = '20px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderRadius = '4px';
              }}
            >
              <FaBars size={20} />
            </button>
          </>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#743014',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
              }}
              onClick={toggleExpand}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'rgba(116, 48, 20, 0.1)';
                e.currentTarget.style.borderRadius = '20px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderRadius = '4px';
              }}
            >
              <FaBars size={20} />
            </button>
          </div>
        )}
      </div>

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          flex: 1,
          overflowY: 'auto',
        }}
      >
        {navBarItems.map((item, index) => (
          <li
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1rem',
              paddingLeft: isExpanded || isHovered ? '2rem' : '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: location.pathname === item.path ? '#e8d1a7' : '#743014',
              backgroundColor:
                location.pathname === item.path ? '#743014' : 'transparent',
              justifyContent: isExpanded || isHovered ? 'flex-start' : 'center',
              borderRadius: location.pathname === item.path ? '20px' : '0px',
              margin: '0 0.5rem',
              marginBottom: '0.25rem',
            }}
            onClick={() => handleNavigation(item.path)}
            onMouseEnter={(e) => {
              if (location.pathname !== item.path) {
                e.currentTarget.style.backgroundColor =
                  'rgba(116, 48, 20, 0.1)';
                e.currentTarget.style.borderRadius = '20px';
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== item.path) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderRadius = '0px';
              }
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '24px',
                width: isExpanded || isHovered ? 'auto' : '100%',
              }}
            >
              {item.icon}
            </div>
            {(isExpanded || isHovered) && (
              <span
                style={{
                  marginLeft: '1rem',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ul>

      <div
        style={{
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isExpanded || isHovered ? 'space-between' : 'center',
          minHeight: '80px',
          flexDirection: isExpanded || isHovered ? 'row' : 'column',
          gap: '0.5rem',
        }}
      >
        {isExpanded || isHovered ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#743014',
                  color: '#e8d1a7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '0.75rem',
                }}
              >
                <BiUser size={20} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#743014',
                    lineHeight: 1.2,
                  }}
                >
                  Administrador
                </span>
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: '#743014',
                    opacity: 0.8,
                    lineHeight: 1.2,
                  }}
                >
                  @carolina.padilha
                </span>
              </div>
            </div>
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#743014',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'rgba(116, 48, 20, 0.1)';
                e.currentTarget.style.borderRadius = '20px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderRadius = '4px';
              }}
            >
              <FaSignOutAlt size={18} />
            </button>
          </>
        ) : (
          <>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#743014',
                color: '#e8d1a7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BiUser size={20} />
            </div>
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#743014',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'rgba(116, 48, 20, 0.1)';
                e.currentTarget.style.borderRadius = '20px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderRadius = '4px';
              }}
            >
              <FaSignOutAlt size={18} />
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
