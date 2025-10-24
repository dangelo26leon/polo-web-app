import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductsPage from './components/ProductsPage';
import Cart from './components/Cart';
import CheckoutPage from './components/CheckoutPage';
import AuthPage from './components/AuthPage';
import UserProfile from './components/UserProfile';
import SearchFilter from './components/SearchFilter';
import FavoritesPage from './components/FavoritePage';
import { Package, Phone, MapPin, Mail, Star, Heart } from 'lucide-react';
import logoPolo from '/images/logo_polo.png';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  rating: number;
  category: string;
  description?: string;
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
  const [currentPage, setCurrentPage] = useState<'home' | 'products' | 'checkout' | 'auth' | 'profile' | 'favorites'>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [user, setUser] = useState<UserData | null>(null);

  const allProducts: Product[] = [
    { 
      id: 1, 
      name: 'Arrocera Eléctrica 700W', 
      price: 'S/ 109.00', 
      image: 'https://rimage.ripley.com.pe/home.ripley/Attachment/MKP/702/PMP00003044128/full_image-1.webp', 
      rating: 4.5, 
      category: 'Electrodomésticos',
      description: 'Arrocera eléctrica de 1.8L con función de mantener caliente y cocción automática.'
    },
    { 
      id: 2, 
      name: 'Licuadora Premium 1200W', 
      price: 'S/ 160.00', 
      image: 'https://home.ripley.com.pe/Attachment/WOP_5/2019312376558/2019312376558_2.jpg',  
      rating: 4.8, 
      category: 'Electrodomésticos',
      description: 'Licuadora de alta potencia con 5 velocidades y jarra de vidrio resistente.'
    },
    { 
      id: 3, 
      name: 'Tostadora 4 Rebanadas 1600W', 
      price: 'S/ 98.00', 
      image: 'https://rimage.ripley.com.pe/home.ripley/Attachment/WOP/1/2019338973328/full_image-2019338973328.jpg', 
      rating: 4.3, 
      category: 'Electrodomésticos',
      description: 'Tostadora de 4 rebanadas con 7 niveles de tostado y bandeja recogemigas extraíble.'
    },
    { 
      id: 4, 
      name: 'Batidora de Mano 250W', 
      price: 'S/ 90.00', 
      image: 'https://osterpe.vtexassets.com/arquivos/ids/156585-1600-auto?v=637492689214070000&width=1600&height=auto&aspect=true', 
      rating: 4.6, 
      category: 'Electrodomésticos',
      description: 'Batidora de mano con 6 velocidades y accesorios incluidos.'
    },
    { 
      id: 5, 
      name: 'Plancha de Vapor 1200W', 
      price: 'S/ 59.00', 
      image: 'http://home.ripley.com.pe/Attachment/WOP_5/2019321652148/2019321652148_2.jpg', 
      rating: 4.4, 
      category: 'Electrodomésticos',
      description: 'Plancha de vapor con suela antiadherente, 2 niveles de vapor y función autolimpieza.'
    },
    { 
      id: 6, 
      name: 'Cargador USB-C Rápido 65W', 
      price: 'S/ 45.00', 
      image: 'https://promart.vteximg.com.br/arquivos/ids/8510663-1000-1000/imageUrl_1.jpg?v=638705341603330000', 
      rating: 4.4, 
      category: 'Tecnología',
      description: 'Cargador de carga rápida compatible con laptops y dispositivos móviles.'
    },
    { 
      id: 7, 
      name: 'Audífonos Bluetooth Inalámbricos', 
      price: 'S/ 99.00', 
      image: 'https://oechsle.vteximg.com.br/arquivos/ids/19773389-1000-1000/imageUrl_2.jpg?v=638673301908100000', 
      rating: 4.7, 
      category: 'Tecnología',
      description: 'Audífonos inalámbricos con cancelación de ruido y 30 horas de batería.'
    },
    { 
      id: 8, 
      name: 'Adaptador HDMI 4K', 
      price: 'S/ 35.00', 
      image: 'https://promart.vteximg.com.br/arquivos/ids/2128560-1000-1000/10093308.jpg?v=637680073113370000', 
      rating: 4.2, 
      category: 'Tecnología',
      description: 'Adaptador HDMI compatible con resolución 4K y audio de alta definición.'
    },
    { 
      id: 9, 
      name: 'Cable Lightning Certificado', 
      price: 'S/ 50.00', 
      image: 'https://todatecnologia.pe/wp-content/uploads/2024/06/Cable-UGREEN-USB-C-a-Lightning-Cable-MFI-Certificado-PD-Carga-Rapida-Compatible-con-iPhone-iPad-Pro-3-600x600.png', 
      rating: 4.5, 
      category: 'Tecnología',
      description: 'Cable Lightning certificado MFi de 2 metros con carga rápida.'
    },
    { 
      id: 10, 
      name: 'Freidora de aire 2.5L', 
      price: 'S/ 179.00', 
      image: 'https://www.record.com.pe/wp-content/uploads/2021/05/2_2106500002_2.jpg', 
      rating: 4.5, 
      category: 'Electrodomésticos',
      description: 'Freidora de aire record inoxidable collection 2.5L.'
    },
    { 
      id: 11, 
      name: 'Cafetera 12 TZS', 
      price: 'S/ 199.00', 
      image: 'https://electroabad.pe/wp-content/uploads/2020/07/BVSTDCDR5B_0-2.jpg', 
      rating: 4.2, 
      category: 'Electrodomésticos',
      description: 'Cafetera 12 tzs con pantalla táctil programable Oster'
    },
    { 
      id: 12, 
      name: 'Exprimidor de cítricos 1.2L', 
      price: 'S/ 79.90', 
      image: 'https://rimage.ripley.com.pe/home.ripley/Attachment/MKP/2095/PMP20000309369/imagen2-1.jpeg', 
      rating: 4.0, 
      category: 'Electrodomésticos',
      description: 'Capacidad de 1.2 L. - Base antideslizante - Cono exprimidor doble.'
    },
    { 
      id: 13, 
      name: 'Hervidor eléctrico 1.7L', 
      price: 'S/ 75.90', 
      image: 'https://home.ripley.com.pe/Attachment/WOP_5/2019281130182/2019281130182-2.jpg', 
      rating: 4.5, 
      category: 'Electrodomésticos',
      description: 'Hervidor Oster eléctrico negro BVSTKT3101 1.7L'
    },
    { 
      id: 14, 
      name: 'Waflera Taurus 1000W', 
      price: 'S/ 79.00', 
      image: 'https://media.falabella.com/falabellaPE/20556491_3/w=800,h=800,fit=pad', 
      rating: 4.0, 
      category: 'Electrodomésticos',
      description: 'La nueva Waflera Sweet Cooking de Taurus será tu mejor aliada para obtener unos Waffles perfectos'
    },
    { 
      id: 15, 
      name: 'Sandwichera loven 2 panes', 
      price: 'S/ 89.00', 
      image: 'https://rimage.ripley.com.pe/home.ripley/Attachment/MKP/3932/PMP20000715072/full_image-1.png', 
      rating: 4.1, 
      category: 'Electrodomésticos',
      description: 'Prepara exquisitos Sándwiches, Omelettes o Paninis con esta increíble Sandwichera 3-en 1'
    },
    { 
      id: 16, 
      name: 'Extractora Oster 400W', 
      price: 'S/ 209.00', 
      image: 'https://osterpe.vtexassets.com/arquivos/ids/156074-800-auto?v=637279182621530000&width=800&height=auto&aspect=true', 
      rating: 4.0, 
      category: 'Electrodomésticos',
      description: 'Motor potente y duradero para preparar todo tipo de jugos, incluso de las frutas y vegetales más duros.'
    },
    { 
      id: 17, 
      name: 'FOCO TP-LINK Tapo Multicolor', 
      price: 'S/ 35.90', 
      image: 'https://media.falabella.com/falabellaPE/117158616_01/w=800,h=800,fit=pad', 
      rating: 4.2, 
      category: 'Tecnología',
      description: 'La Tp-Link Tapo L530E es una bombilla de luz Wi-Fi inteligente multicolor.'
    },
    { 
      id: 18, 
      name: 'Cinta Luz RGB 5M', 
      price: 'S/ 30.00', 
      image: 'https://media.falabella.com/falabellaPE/122559405_01/w=1500,h=1500,fit=pad', 
      rating: 4.5, 
      category: 'Tecnología',
      description: 'Cinta luz RGB 5 metros + control.'
    },
    { 
      id: 19, 
      name: 'Estabilizador Forza 900VA', 
      price: 'S/ 45.00', 
      image: 'https://dasmitec.pe/wp-content/uploads/2024/12/FVR-2202.1.jpg', 
      rating: 4.2, 
      category: 'Tecnología',
      description: 'Estabilizador Forza 8 TOMAS/900VA FVR-902.'
    },
    { 
      id: 20, 
      name: 'Parlantes Bluetooth 60W', 
      price: 'S/ 55.00', 
      image: 'https://rimage.ripley.com.pe/home.ripley/Attachment/MKP/4348/PMP20000829411/full_image-1.png', 
      rating: 4.3, 
      category: 'Tecnología',
      description: 'Parlantes bluetooth elite J1 60W, Certificación IPX6 16 horas.'
    },
    { 
      id: 21, 
      name: 'Auriculares Inalámbricos', 
      price: 'S/ 49.00', 
      image: 'https://media.falabella.com/falabellaPE/141369551_01/w=800,h=800,fit=pad', 
      rating: 4.9,
      category: 'Tecnología',
      description: 'Audífonos xiaomi In ear negro redmi buds 6 lite Bluetooth'
    },
    { 
      id: 22, 
      name: 'Teclado Inalámbrico + Mouse', 
      price: 'S/ 100.00', 
      image: 'https://www.lacuracao.pe/media/catalog/product/t/e/tecladomousewirn_1.jpg?quality=80&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700', 
      rating: 4.6,
      category: 'Tecnología',
      description: 'Kit teclado inalámbrico y mouse negro.'
    },
    { 
      id: 23, 
      name: 'Arrocera Imaco 0.6L', 
      price: 'S/ 59.00', 
      image: 'https://carsaperupoc.vtexassets.com/arquivos/ids/161677-1200-auto?v=638657751265170000&width=1200&height=auto&aspect=true', 
      rating: 4.5,
      category: 'Electrodomésticos',
      description: 'Prepara arroz de manera rápida y eficiente con la olla arrocera Imaco RC006N de 0.6 litros en color negro.'
    },
    { 
      id: 24, 
      name: 'Calculadora Cientídica Casio Fx-95Es Plus', 
      price: 'S/ 71.00', 
      image: 'https://production-tailoy-repo-magento-statics.s3.amazonaws.com/imagenes/872x872/productos/i/c/a/calculadora-cientifica-casio-fx-95-7673-default-1.jpg', 
      rating: 4.7,
      category: 'Tecnología',
      description: 'Funciones matemáticas básicas y Cantidad de funciones: 274'
    },
    { 
      id: 25, 
      name: 'Mando Inalámbrico Seisa', 
      price: 'S/ 50.00', 
      image: 'https://plazavea.vteximg.com.br/arquivos/ids/5334496-1000-1000/image-1f8a0817c76c4e78b453ec1d3a111e9f.jpg', 
      rating: 4.8,
      category: 'Tecnología',
      description: 'Compatible para PC, PSII, PSIII, PC360(XBOX), ANDROID, SMART TV BOX. La transmisión inalámbrica se puede utilizar en 8 metros. '
    },
    
  ];

  const categories = Array.from(new Set(allProducts.map(product => product.category)));

  // Filter products based on search and category
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('inversionesPoloCart');
    const savedFavorites = localStorage.getItem('inversionesPoloFavorites');
    const savedUser = localStorage.getItem('inversionesPoloCurrentUser');
    
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('inversionesPoloCart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('inversionesPoloFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToCart = (product: Product, quantity: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const updateCartQuantity = (id: number, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
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
    localStorage.setItem('inversionesPoloCurrentUser', JSON.stringify(userData));
    setCurrentPage('checkout');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('inversionesPoloCurrentUser');
    setCurrentPage('home');
  };

  const handleUpdateUser = (userData: UserData) => {
    setUser(userData);
    localStorage.setItem('inversionesPoloCurrentUser', JSON.stringify(userData));
  };

  const toggleFavorite = (productId: number) => {
    setFavorites(prevFavorites =>
      prevFavorites.includes(productId)
        ? prevFavorites.filter(id => id !== productId)
        : [...prevFavorites, productId]
    );
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

  // If we're on the auth page, render the AuthPage component
  if (currentPage === 'auth') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          cartItems={getTotalCartItems()} 
          onCartClick={() => setIsCartOpen(true)} 
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          user={user}
          onProfileClick={() => setCurrentPage('profile')}
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
      <div className="min-h-screen bg-gray-50">
        <Header 
          cartItems={getTotalCartItems()} 
          onCartClick={() => setIsCartOpen(true)} 
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          user={user}
          onProfileClick={() => setCurrentPage('profile')}
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
      <div className="min-h-screen bg-gray-50">
        <Header 
          cartItems={getTotalCartItems()} 
          onCartClick={() => setIsCartOpen(true)} 
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          user={user}
          onProfileClick={() => setCurrentPage('profile')}
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
      <div className="min-h-screen bg-gray-50">
        <Header 
          cartItems={getTotalCartItems()} 
          onCartClick={() => setIsCartOpen(true)} 
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          user={user}
          onProfileClick={() => setCurrentPage('profile')}
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
      <div className="min-h-screen bg-gray-50">
        <Header 
          cartItems={getTotalCartItems()} 
          onCartClick={() => setIsCartOpen(true)} 
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          user={user}
          onProfileClick={() => setCurrentPage('profile')}
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
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartItems={getTotalCartItems()} 
        onCartClick={() => setIsCartOpen(true)} 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        user={user}
        onProfileClick={() => setCurrentPage('profile')}
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

      {/* Hero Section */}
      <section id="inicio" className="bg-gradient-to-r from-green-800 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              {user ? `¡Bienvenido ${user.firstName}!` : 'Bienvenidos a Inversiones Polo'}
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
      <section id="productos" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Nuestros Productos</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ofrecemos una amplia variedad de electrodomésticos y tecnología de alta calidad
            </p>
          </div>

          <SearchFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
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
                  window.scrollTo(0,0);
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
              <p className="text-gray-500 text-lg">No se encontraron productos</p>
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
      <section id="sobre-nosotros" className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Sobre Nosotros</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Inversiones Polo es una empresa familiar con más de 10 años de experiencia en el mercado. 
              Nos dedicamos a ofrecer productos de alta calidad a precios competitivos, 
              siempre con el mejor servicio al cliente.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Calidad Garantizada</h3>
              <p className="text-gray-600">Todos nuestros productos cuentan con garantía y certificaciones de calidad</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Atención 24/7</h3>
              <p className="text-gray-600">Nuestro equipo está disponible para ayudarte en cualquier momento</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Entrega Rápida</h3>
              <p className="text-gray-600">Realizamos entregas en toda la ciudad de forma rápida y segura</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Contáctanos</h2>
            <p className="text-lg text-gray-300">
              Estamos aquí para ayudarte. No dudes en contactarnos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Información de Contacto</h3>
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
              <h3 className="text-xl font-semibold mb-4">Horarios de Atención</h3>
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
              <img src={logoPolo} alt="Inversiones Polo Logo" className='h-10 w-10' />
              <span className="text-lg font-semibold">Inversiones Polo</span>
            </div>
            <div className="flex items-center mb-4 md:mb-0">
              <ul className='list-disc pl-5 space-y-1 text-base'>
                <li>León Valderrama Dangelo Alexander</li>
                <li>Oyola Valverde Angel Sebastian</li>
                <li>Torrejon Pereda Alejandro</li>
                <li>Gomez Ramirez Andy</li>

              </ul>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400">
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