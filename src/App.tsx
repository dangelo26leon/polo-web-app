import { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductsPage from './components/ProductsPage';
import Cart from './components/Cart';
import CheckoutPage from './components/CheckoutPage';
import AuthPage from './components/AuthPage';
import UserProfile from './components/UserProfile';
import SearchFilter from './components/SearchFilter';
import FavoritesPage from './components/FavoritePage';
import Toast from './components/Toast';
import allProductsData from './data/Products.json';
import { Package, Phone, MapPin, Mail } from 'lucide-react';
import logoPolo from '/images/logo_polo.png';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  rating: number;
  category: string;
  description?: string;
  stock: number; // 👈 NUEVO
}

interface CartItem extends Product {
  quantity: number;
}

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

function App() {
  const [currentPage, setCurrentPage] = useState<
    'home' | 'products' | 'checkout' | 'auth' | 'profile' | 'favorites'
  >('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [user, setUser] = useState<UserData | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const allProducts: Product[] = [...allProductsData];

  const categories = Array.from(
    new Set(allProducts.map((product) => product.category))
  );

  // Filter products based on search and category
  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === '' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('inversionesPoloCart');
    const savedFavorites = localStorage.getItem('inversionesPoloFavorites');
    const savedUser = localStorage.getItem('inversionesPoloCurrentUser');
    const savedSearchHistory = localStorage.getItem(
      'inversionesPoloSearchHistory'
    );
    const savedDarkMode = localStorage.getItem('inversionesPoloDarkMode');

    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedSearchHistory) {
      try {
        setSearchHistory(JSON.parse(savedSearchHistory));
      } catch (error) {
        console.error('Error parsing inversionesPoloSearchHistory', error);
      }
    }

    if (savedDarkMode) {
      const isDark = JSON.parse(savedDarkMode);
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('inversionesPoloCart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      'inversionesPoloFavorites',
      JSON.stringify(favorites)
    );
  }, [favorites]);

  // Manejar cambios en el texto del buscador (solo cambia el término, no guarda historial aún)
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  // Guardar una búsqueda completa en el historial
  const handleCommitSearch = (term: string) => {
    const cleanTerm = term.trim();
    if (cleanTerm.length === 0) return;

    setSearchHistory((prev) => {
      const filtered = prev.filter(
        (t) => t.toLowerCase() !== cleanTerm.toLowerCase()
      );
      const updated = [cleanTerm, ...filtered].slice(0, 5);
      localStorage.setItem(
        'inversionesPoloSearchHistory',
        JSON.stringify(updated)
      );
      return updated;
    });
  };

  const handleSearchFromHistory = (term: string) => {
    setSearchTerm(term);
    handleCommitSearch(term);
  };

  const handleClearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('inversionesPoloSearchHistory');
  };

  // ✅ addToCart con control de STOCK
  const addToCart = (product: Product, quantity: number) => {
    if (product.stock <= 0) {
      setToastMessage(`No hay stock disponible de ${product.name}.`);
      return;
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      const currentQuantity = existingItem ? existingItem.quantity : 0;
      const maxQuantity = product.stock;

      const desiredQuantity = currentQuantity + quantity;
      const finalQuantity =
        desiredQuantity > maxQuantity ? maxQuantity : desiredQuantity;

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: finalQuantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: finalQuantity }];
      }
    });

    setToastMessage(`${product.name} agregado al carrito.`);
  };

  const updateCartQuantity = (id: number, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleProceedToCheckout = () => {
    if (user) {
      setCurrentPage('checkout');
      setIsCartOpen(false);
    } else {
      setCurrentPage('auth');
      setIsCartOpen(false);
    }
  };

  const handleOrderComplete = () => {
    clearCart();
    setCurrentPage('home');
  };

  const handleLogin = (userData: UserData) => {
    setUser(userData);
    localStorage.setItem(
      'inversionesPoloCurrentUser',
      JSON.stringify(userData)
    );
    setCurrentPage('checkout');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('inversionesPoloCurrentUser');
    setCurrentPage('home');
  };

  const handleUpdateUser = (userData: UserData) => {
    setUser(userData);
    localStorage.setItem(
      'inversionesPoloCurrentUser',
      JSON.stringify(userData)
    );
  };

  const toggleFavorite = (productId: number) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(productId)) {
        setToastMessage('Producto eliminado de favoritos.');
        return prevFavorites.filter((id) => id !== productId);
      } else {
        setToastMessage('Producto agregado a favoritos.');
        return [...prevFavorites, productId];
      }
    });
  };

  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const scrollToProducts = () => {
    const element = document.getElementById('productos');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const element = document.getElementById('contacto');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('inversionesPoloDarkMode', JSON.stringify(newDarkMode));
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // If we're on the auth page, render the AuthPage component
  if (currentPage === 'auth') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header
          cartItems={getTotalCartItems()}
          onCartClick={() => setIsCartOpen(true)}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          user={user}
          onProfileClick={() => setCurrentPage('profile')}
          onToggleTheme={toggleTheme}
        />

        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={updateCartQuantity}
          onRemoveItem={removeFromCart}
          onClearCart={clearCart}
          onProceedToCheckout={handleProceedToCheckout}
          user={user}
        />

        {toastMessage && (
          <Toast
            message={toastMessage}
            onClose={() => setToastMessage('')}
          />
        )}

        <AuthPage
          onBack={() => setCurrentPage('home')}
          onLogin={handleLogin}
        />
      </div>
    );
  }

  // If we're on the profile page, render the UserProfile component
  if (currentPage === 'profile') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header
          cartItems={getTotalCartItems()}
          onCartClick={() => setIsCartOpen(true)}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          user={user}
          onProfileClick={() => setCurrentPage('profile')}
          onToggleTheme={toggleTheme}
        />

        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={updateCartQuantity}
          onRemoveItem={removeFromCart}
          onClearCart={clearCart}
          onProceedToCheckout={handleProceedToCheckout}
          user={user}
        />

        {toastMessage && (
          <Toast
            message={toastMessage}
            onClose={() => setToastMessage('')}
          />
        )}

        {user && (
          <UserProfile
            user={user}
            onUpdateUser={handleUpdateUser}
            onLogout={handleLogout}
            onBack={() => setCurrentPage('home')}
          />
        )}
      </div>
    );
  }

  // If we're on the favorites page, render the FavoritesPage component
  if (currentPage === 'favorites') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header
          cartItems={getTotalCartItems()}
          onCartClick={() => setIsCartOpen(true)}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          user={user}
          onProfileClick={() => setCurrentPage('profile')}
          onToggleTheme={toggleTheme}
        />

        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={updateCartQuantity}
          onRemoveItem={removeFromCart}
          onClearCart={clearCart}
          onProceedToCheckout={handleProceedToCheckout}
          user={user}
        />

        {toastMessage && (
          <Toast
            message={toastMessage}
            onClose={() => setToastMessage('')}
          />
        )}

        <FavoritesPage
          allProducts={allProducts}
          favorites={favorites}
          onAddToCart={addToCart}
          onToggleFavorite={toggleFavorite}
          onBack={() => setCurrentPage('home')}
        />
      </div>
    );
  }

  // If we're on the checkout page, render the CheckoutPage component
  if (currentPage === 'checkout') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header
          cartItems={getTotalCartItems()}
          onCartClick={() => setIsCartOpen(true)}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          user={user}
          onProfileClick={() => setCurrentPage('profile')}
          onToggleTheme={toggleTheme}
        />

        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={updateCartQuantity}
          onRemoveItem={removeFromCart}
          onClearCart={clearCart}
          onProceedToCheckout={handleProceedToCheckout}
          user={user}
        />

        {toastMessage && (
          <Toast
            message={toastMessage}
            onClose={() => setToastMessage('')}
          />
        )}

        <CheckoutPage
          cartItems={cartItems}
          onBack={() => setCurrentPage('home')}
          onOrderComplete={handleOrderComplete}
          user={user}
        />
      </div>
    );
  }

  // If we're on the products page, render the ProductsPage component
  if (currentPage === 'products') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header
          cartItems={getTotalCartItems()}
          onCartClick={() => setIsCartOpen(true)}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          user={user}
          onProfileClick={() => setCurrentPage('profile')}
          onToggleTheme={toggleTheme}
        />

        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={updateCartQuantity}
          onRemoveItem={removeFromCart}
          onClearCart={clearCart}
          onProceedToCheckout={handleProceedToCheckout}
          user={user}
        />

        {toastMessage && (
          <Toast
            message={toastMessage}
            onClose={() => setToastMessage('')}
          />
        )}

        <ProductsPage
          products={allProducts}
          onAddToCart={addToCart}
          onToggleFavorite={toggleFavorite}
          favorites={favorites}
          onBack={() => setCurrentPage('home')}
        />
      </div>
    );
  }

  // Home page content
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        cartItems={getTotalCartItems()}
        onCartClick={() => setIsCartOpen(true)}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        user={user}
        onProfileClick={() => setCurrentPage('profile')}
        onToggleTheme={toggleTheme}
      />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        onProceedToCheckout={handleProceedToCheckout}
        user={user}
      />

      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage('')}
        />
      )}

      {/* Hero Section */}
      <section
        id="inicio"
        className="bg-gradient-to-r from-green-800 to-green-600 text-white dark:from-green-900 dark:to-green-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              {user
                ? `¡Bienvenido ${user.firstName}!`
                : 'Bienvenidos a Inversiones Polo'}
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-green-100">
              Tu tienda de confianza para electrodomésticos y tecnología
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={scrollToProducts}
                className="bg-white text-green-800 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                Ver Productos
              </button>
              <button
                onClick={scrollToContact}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-800 transition-colors"
              >
                Contactar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="productos" className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Nuestros Productos
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
              Ofrecemos una amplia variedad de electrodomésticos y tecnología de
              alta calidad
            </p>
          </div>

          <SearchFilter
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
            searchHistory={searchHistory}
            onClearHistory={handleClearSearchHistory}
            onSearchFromHistory={handleSearchFromHistory}
            onCommitSearch={handleCommitSearch}
          />

          {/* Show only first 8 products on home page */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {filteredProducts.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onToggleFavorite={toggleFavorite}
                isFavorite={favorites.includes(product.id)}
              />
            ))}
          </div>

          {/* Show "Ver todos los productos" button if there are more than 8 products */}
          {allProducts.length > 8 && (
            <div className="text-center">
              <button
                onClick={() => {
                  setCurrentPage('products');
                  window.scrollTo(0, 0);
                }}
                className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Ver Todos los Productos ({allProducts.length})
              </button>
            </div>
          )}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No se encontraron productos
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
                className="mt-4 text-green-700 hover:text-green-800 font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="sobre-nosotros" className="py-16 bg-green-50 dark:bg-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Sobre Nosotros
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto dark:text-gray-300">
              Inversiones Polo es una empresa familiar con más de 10 años de
              experiencia en el mercado. Nos dedicamos a ofrecer productos de
              alta calidad a precios competitivos, siempre con el mejor servicio
              al cliente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-green-600">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Calidad Garantizada
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Todos nuestros productos cuentan con garantía y certificaciones
                de calidad
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-green-600">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Atención 24/7
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Nuestro equipo está disponible para ayudarte en cualquier
                momento
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-green-600">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Entrega Rápida
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Realizamos entregas en toda la ciudad de forma rápida y segura
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-16 bg-gray-900 dark:bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Contáctanos
            </h2>
            <p className="text-lg text-gray-300 dark:text-gray-400">
              Estamos aquí para ayudarte. No dudes en contactarnos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Información de Contacto
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-green-400 mr-3" />
                  <span>+51 987-654-321</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-green-400 mr-3" />
                  <span>poloinversiones@gmail.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-green-400 mr-3" />
                  <span>Mercado Buenos Aires, Nuevo Chimbote</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">
                Horarios de Atención
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Lunes - Viernes:</span>
                  <span>8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábados:</span>
                  <span>9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingos:</span>
                  <span>9:00 AM - 3:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img
                src={logoPolo}
                alt="Inversiones Polo Logo"
                className="h-10 w-10"
              />
              <span className="text-lg font-semibold">Inversiones Polo</span>
            </div>
            <div className="flex items-center mb-4 md:mb-0">
              <ul className="list-disc pl-5 space-y-1 text-base">
                <li>León Valderrama Dangelo Alexander</li>
                <li>Oyola Valverde Angel Sebastian</li>
                <li>Torrejon Pereda Alejandro</li>
                <li>Gomez Ramirez Andy</li>
              </ul>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 dark:text-gray-500">
                © 2025 Inversiones Polo. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
