import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductCardList from './ProductCardList';
import SkeletonCard from './SkeletonCard';
import SearchFilter from './SearchFilter';
import { Package, ArrowLeft, Grid3X3, List } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  rating: number;
  category: string;
  description?: string;
  stock: number;
}

interface ProductsPageProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
  onToggleFavorite: (productId: number) => void;
  favorites: number[];
  onBack: () => void;
}

const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  onAddToCart,
  onToggleFavorite,
  favorites,
  onBack
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for skeleton effect
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [products]);

  // Load view mode preference from localStorage
  useEffect(() => {
    const savedViewMode = localStorage.getItem('inversionesPoloViewMode');
    if (savedViewMode === 'grid' || savedViewMode === 'list') {
      setViewMode(savedViewMode);
    }
  }, []);

  // Save view mode preference
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    localStorage.setItem('inversionesPoloViewMode', mode);
  };

  const categories = Array.from(new Set(products.map(product => product.category)));

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.price.replace('S/ ', '')) - 
                 parseFloat(b.price.replace('S/ ', ''));
        case 'price-high':
          return parseFloat(b.price.replace('S/ ', '')) - 
                 parseFloat(a.price.replace('S/ ', ''));
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium mr-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver al Inicio
          </button>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Nuestros Productos</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
              Descubre nuestra amplia selección de electrodomésticos y tecnología
            </p>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <SearchFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                categories={categories}
              />
            </div>
            
            {/* Sort Options */}
            <div className="lg:w-64">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ordenar por:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
              >
                <option value="name">Nombre (A-Z)</option>
                <option value="price-low">Precio (Menor a Mayor)</option>
                <option value="price-high">Precio (Mayor a Menor)</option>
                <option value="rating">Mejor Calificación</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="lg:w-auto">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Vista:
              </label>
              <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <button
                  onClick={() => handleViewModeChange('grid')}
                  className={`p-2 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-green-700 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                  title="Vista en cuadrícula"
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleViewModeChange('list')}
                  className={`p-2 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-green-700 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                  title="Vista en lista"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Stats */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <p className="text-gray-600 dark:text-gray-400 mb-2 sm:mb-0">
            Mostrando {filteredProducts.length} de {products.length} productos
            {selectedCategory && ` en "${selectedCategory}"`}
            {searchTerm && ` para "${searchTerm}"`}
          </p>
          
          {(searchTerm || selectedCategory) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className="text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium text-sm"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Products Grid/List */}
        {isLoading ? (
          // Skeleton Loading
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "flex flex-col gap-4"
          }>
            {[...Array(8)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          viewMode === 'grid' ? (
            // Grid View
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className={`animate-pop-in opacity-0 stagger-${(index % 8) + 1}`}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={onAddToCart}
                    onToggleFavorite={onToggleFavorite}
                    isFavorite={favorites.includes(product.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            // List View
            <div className="flex flex-col gap-4">
              {filteredProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className={`animate-slide-up opacity-0`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProductCardList
                    product={product}
                    onAddToCart={onAddToCart}
                    onToggleFavorite={onToggleFavorite}
                    isFavorite={favorites.includes(product.id)}
                  />
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-16">
            <Package className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Intenta ajustar tus filtros de búsqueda
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Ver todos los productos
            </button>
          </div>
        )}

        {/* Category Showcase */}
        {!searchTerm && !selectedCategory && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Explora por Categorías
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categories.map((category) => {
                const categoryProducts = products.filter(p => p.category === category);
                const featuredProduct = categoryProducts[0];
                
                return (
                  <div
                    key={category}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedCategory(category)}
                  >
                    <div className="flex">
                      <div className="flex-1 p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {category}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {categoryProducts.length} productos disponibles
                        </p>
                        <button className="text-green-700 hover:text-green-800 font-medium">
                          Ver todos →
                        </button>
                      </div>
                      {featuredProduct && (
                        <div className="w-32 h-32">
                          <img
                            src={featuredProduct.image}
                            alt={category}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;