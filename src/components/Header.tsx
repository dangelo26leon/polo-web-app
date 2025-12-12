import React, { useState } from 'react';
import { Menu, X, ShoppingCart, Home, User, LogOut, Heart, Sun, Moon } from 'lucide-react';
import logoPolo from '/images/logo_polo.png';

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface HeaderProps {
  cartItems: number;
  onCartClick: () => void;
  currentPage?: 'home' | 'products' | 'checkout' | 'auth' | 'profile' | 'favorites';
  onNavigate?: (page: 'home' | 'products' | 'checkout' | 'auth' | 'profile' | 'favorites') => void;
  user?: UserData | null;
  onProfileClick?: () => void;
  onToggleTheme: () => void;
  cartAnimation?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  cartItems, 
  onCartClick, 
  currentPage = 'home',
  onNavigate,
  user,
  onProfileClick,
  onToggleTheme,
  cartAnimation = false
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    if (currentPage !== 'home') {
      onNavigate?.('home');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  const handleProductsClick = () => {
    if (currentPage === 'home') {
      onNavigate?.('products'),
      window.scrollTo(0,0);
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer" 
              onClick={() => {
                if (currentPage !== 'home') {
                  onNavigate?.('home');
                } else {
                  scrollToSection('inicio');
                }
              }}
            >
              <img src={logoPolo} alt="Inversiones Polo Logo" className='h-12 w-12' />
              <span className="ml-2 text-xl font-bold text-green-800 dark:text-green-400">Inversiones Polo</span>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button 
                onClick={() => {
                  if (currentPage !== 'home') {
                    onNavigate?.('home');
                  } else {
                    scrollToSection('inicio');
                  }
                }}
                className={`${
                  currentPage === 'home' ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400'
                } px-3 py-2 text-sm font-medium transition-colors`}
              >
                Inicio
              </button>
              <button 
                onClick={handleProductsClick}
                className={`${
                  currentPage === 'products' ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400'
                } px-3 py-2 text-sm font-medium transition-colors`}
              >
                Productos
              </button>
              <button 
                onClick={() => scrollToSection('sobre-nosotros')}
                className="text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                Nosotros
              </button>
              <button 
                onClick={() => scrollToSection('contacto')}
                className="text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                Contacto
              </button>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <button
                onClick={onToggleTheme}
                className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                {/* Muestra el Sol si está en modo oscuro (para cambiar a Claro) y la Luna si está en modo claro (para cambiar a Oscuro) */}
                {window.document.documentElement.classList.contains('dark') ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              <button 
                onClick={onCartClick}
                className={`bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center transition-all relative ${
                  cartAnimation ? 'animate-cart-bounce' : ''
                }`}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Carrito
                {cartItems > 0 && (
                  <span className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ${
                    cartAnimation ? 'animate-pulse-ring' : ''
                  }`}>
                    {cartItems}
                  </span>
                )}
              </button>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 transition-colors"
                  >
                    <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">{user.firstName}</span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1 z-50">
                      <button
                        onClick={() => {
                          onProfileClick?.();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Mi Perfil
                      </button>
                      <button
                        onClick={() => {
                          onNavigate?.('favorites');
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          currentPage === 'favorites' ? 'bg-gray-100 dark:bg-gray-600 text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'
                        } hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center`}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Mis Favoritos
                      </button>
                      <button
                        onClick={() => {
                          // Handle logout
                          localStorage.removeItem('inversionesPoloCurrentUser');
                          window.location.reload();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => onNavigate?.('auth')}
                  className="flex items-center px-4 py-2 border border-green-700 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <User className="w-4 h-4 mr-2" />
                  Iniciar Sesión
                </button>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-700 border-t dark:border-gray-600">
            <button 
              onClick={() => {
                if (currentPage !== 'home') {
                  onNavigate?.('home');
                } else {
                  scrollToSection('inicio');
                }
              }}
              className={`${
                currentPage === 'home' ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400'
              } block px-3 py-2 text-base font-medium w-full text-left`}
            >
              Inicio
            </button>
            <button 
              onClick={handleProductsClick}
              className={`${
                currentPage === 'products' ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400'
              } block px-3 py-2 text-base font-medium w-full text-left`}
            >
              Productos
            </button>
            <button 
              onClick={() => scrollToSection('sobre-nosotros')}
              className="text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 block px-3 py-2 text-base font-medium w-full text-left"
            >
              Nosotros
            </button>
            <button 
              onClick={() => scrollToSection('contacto')}
              className="text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 block px-3 py-2 text-base font-medium w-full text-left"
            >
              Contacto
            </button>
            
            <div className="mt-4 space-y-2">
              <button 
                onClick={onCartClick}
                className="w-full bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center justify-center relative"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Carrito
                {cartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems}
                  </span>
                )}
              </button>
            <button
              onClick={() => {
                onToggleTheme();
                setIsMenuOpen(false); // Opcional: cierra el menú al cambiar el tema
              }}
              className="w-full text-left px-4 py-2 text-base font-medium flex items-center text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 transition-colors"
            >
              {window.document.documentElement.classList.contains('dark') ? (
                <Sun className="w-5 h-5 mr-2" />
              ) : (
                <Moon className="w-5 h-5 mr-2" />
              )}
              {window.document.documentElement.classList.contains('dark') ? 'Modo Claro' : 'Modo Oscuro'}
            </button>

              {user ? (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      onProfileClick?.();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-2 text-gray-700 hover:text-green-700 transition-colors"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Mi Perfil ({user.firstName})
                  </button>
                  <button
                    onClick={() => {
                      onNavigate?.('favorites');
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-2 ${
                      currentPage === 'favorites' ? 'text-green-700' : 'text-gray-700'
                    } hover:text-green-700 transition-colors`}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Mis Favoritos
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem('inversionesPoloCurrentUser');
                      window.location.reload();
                    }}
                    className="w-full flex items-center px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onNavigate?.('auth');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center px-4 py-2 border border-green-700 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <User className="w-4 h-4 mr-2" />
                  Iniciar Sesión
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Overlay to close user menu */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsUserMenuOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Header;