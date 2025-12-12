import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductCardList from './ProductCardList';
import SkeletonCard from './SkeletonCard';
import SearchFilter from './SearchFilter';
import { Package, ArrowLeft, Grid3X3, List, SlidersHorizontal, Star, X } from 'lucide-react';

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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Filtros avanzados
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 2000 });
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);

  // Calcular el rango de precios de los productos
  const parsePrice = (price: string) => {
    return parseFloat(price.replace('S/', '').replace(',', '').trim()) || 0;
  };

  const productPrices = products.map(p => parsePrice(p.price));
  const minProductPrice = Math.floor(Math.min(...productPrices));
  const maxProductPrice = Math.ceil(Math.max(...productPrices));

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

  // Contar filtros activos
  const activeFiltersCount = [
    priceRange.min > minProductPrice || priceRange.max < maxProductPrice,
    minRating > 0,
    onlyInStock
  ].filter(Boolean).length;

  // Limpiar todos los filtros avanzados
  const clearAdvancedFilters = () => {
    setPriceRange({ min: minProductPrice, max: maxProductPrice });
    setMinRating(0);
    setOnlyInStock(false);
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
      
      // Filtros avanzados
      const productPrice = parsePrice(product.price);
      const matchesPrice = productPrice >= priceRange.min && productPrice <= priceRange.max;
      const matchesRating = product.rating >= minRating;
      const matchesStock = !onlyInStock || product.stock > 0;
      
      return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStock;
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
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
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

            {/* Advanced Filters Toggle */}
            <div className="lg:w-auto">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filtros:
              </label>
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                  showAdvancedFilters || activeFiltersCount > 0
                    ? 'bg-green-700 text-white border-green-700'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                Avanzados
                {activeFiltersCount > 0 && (
                  <span className="ml-2 bg-white text-green-700 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <SlidersHorizontal className="w-5 h-5 mr-2" />
                  Filtros Avanzados
                </h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAdvancedFilters}
                    className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Limpiar filtros
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Price Range Filter */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    💰 Rango de Precio
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">S/</span>
                      <input
                        type="number"
                        min={minProductPrice}
                        max={priceRange.max}
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                        placeholder="Mínimo"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        min={priceRange.min}
                        max={maxProductPrice}
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                        placeholder="Máximo"
                      />
                    </div>
                    <input
                      type="range"
                      min={minProductPrice}
                      max={maxProductPrice}
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                      className="w-full accent-green-700"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>S/ {minProductPrice}</span>
                      <span>S/ {maxProductPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    ⭐ Rating Mínimo
                  </label>
                  <div className="space-y-2">
                    {[0, 3, 3.5, 4, 4.5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setMinRating(rating)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-colors ${
                          minRating === rating
                            ? 'bg-green-700 text-white border-green-700'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-green-500'
                        }`}
                      >
                        <div className="flex items-center">
                          {rating === 0 ? (
                            <span className="text-sm">Todos</span>
                          ) : (
                            <>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(rating)
                                        ? minRating === rating ? 'fill-white text-white' : 'fill-yellow-400 text-yellow-400'
                                        : minRating === rating ? 'text-white/50' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="ml-2 text-sm">{rating}+</span>
                            </>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stock Filter */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    📦 Disponibilidad
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setOnlyInStock(false)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-colors ${
                        !onlyInStock
                          ? 'bg-green-700 text-white border-green-700'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-green-500'
                      }`}
                    >
                      <span className="text-sm">Mostrar todos</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${!onlyInStock ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'}`}>
                        {products.length}
                      </span>
                    </button>
                    <button
                      onClick={() => setOnlyInStock(true)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-colors ${
                        onlyInStock
                          ? 'bg-green-700 text-white border-green-700'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-green-500'
                      }`}
                    >
                      <span className="text-sm">Solo en stock</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${onlyInStock ? 'bg-white/20' : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400'}`}>
                        {products.filter(p => p.stock > 0).length}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Stats */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <p className="text-gray-600 dark:text-gray-400 mb-2 sm:mb-0">
            Mostrando {filteredProducts.length} de {products.length} productos
            {selectedCategory && ` en "${selectedCategory}"`}
            {searchTerm && ` para "${searchTerm}"`}
            {activeFiltersCount > 0 && ` (${activeFiltersCount} filtro${activeFiltersCount > 1 ? 's' : ''} activo${activeFiltersCount > 1 ? 's' : ''})`}
          </p>
          
          {(searchTerm || selectedCategory || activeFiltersCount > 0) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                clearAdvancedFilters();
              }}
              className="text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium text-sm"
            >
              Limpiar todos los filtros
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
            <div className="flex flex-col gap-4 w-full">
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Explora por Categorías
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categories.map((category) => {
                const categoryProducts = products.filter(p => p.category === category);
                const featuredProduct = categoryProducts[0];
                
                return (
                  <div
                    key={category}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedCategory(category)}
                  >
                    <div className="flex">
                      <div className="flex-1 p-6">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {category}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {categoryProducts.length} productos disponibles
                        </p>
                        <button className="text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium">
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