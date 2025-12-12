import { useState } from 'react';
import { Star, Heart, ShoppingCart, Plus, Minus } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  rating: number;
  description?: string;
  category: string;
  stock: number;
}

interface ProductCardListProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onToggleFavorite: (productId: number) => void;
  isFavorite: boolean;
}

const ProductCardList: React.FC<ProductCardListProps> = ({ 
  product, 
  onAddToCart, 
  onToggleFavorite, 
  isFavorite 
}) => {
  const [quantity, setQuantity] = useState(product.stock > 0 ? 1 : 0);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400 opacity-50" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  const handleDecrease = () => {
    if (product.stock === 0) return;
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    if (product.stock === 0) return;
    setQuantity((prev) => Math.min(product.stock, prev + 1));
  };

  const handleAddToCart = () => {
    if (product.stock === 0 || quantity <= 0) return;
    onAddToCart(product, quantity);
    setQuantity(product.stock > 0 ? 1 : 0);
  };

  // Stock text and color
  let stockText = '';
  let stockColor = '';

  if (product.stock === 0) {
    stockText = 'Sin stock';
    stockColor = 'text-red-600 dark:text-red-400';
  } else if (product.stock <= 3) {
    stockText = `Últimas ${product.stock} unidades`;
    stockColor = 'text-orange-600 dark:text-orange-400';
  } else {
    stockText = `Stock: ${product.stock}`;
    stockColor = 'text-green-700 dark:text-green-400';
  }

  const isOutOfStock = product.stock === 0;

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row">
      {/* Image */}
      <div className="relative sm:w-48 md:w-56 lg:w-64 flex-shrink-0">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 sm:h-full object-cover"
        />
        <button 
          onClick={() => onToggleFavorite(product.id)}
          className="absolute top-2 right-2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorite
                ? 'text-red-500 fill-red-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-red-500'
            }`}
          />
        </button>
        <div className="absolute top-2 left-2 bg-green-700 text-white px-2 py-1 rounded text-xs font-semibold">
          {product.category}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">
            {product.name}
          </h4>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {product.description || `${product.name} de alta calidad, perfecto para uso doméstico. Garantía incluida.`}
          </p>
          
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center">
              {renderStars(product.rating)}
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                ({product.rating})
              </span>
            </div>
            <span className={`text-xs font-medium ${stockColor}`}>
              {stockText}
            </span>
          </div>
        </div>

        {/* Price and Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
          <p className="text-green-700 font-bold text-2xl">
            {product.price}
          </p>
          
          <div className="flex items-center gap-3">
            {/* Quantity Selector */}
            <div className="flex items-center border dark:border-gray-600 rounded-lg">
              <button 
                onClick={handleDecrease}
                disabled={isOutOfStock}
                className={`p-2 transition-colors ${
                  isOutOfStock
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Minus className="w-4 h-4 dark:text-gray-300" />
              </button>
              <span className="px-4 py-2 border-x dark:border-gray-600 dark:text-white bg-green-100 dark:bg-green-700 font-semibold min-w-[48px] text-center">
                {quantity}
              </span>
              <button 
                onClick={handleIncrease}
                disabled={isOutOfStock || quantity >= product.stock}
                className={`p-2 transition-colors ${
                  isOutOfStock || quantity >= product.stock
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Plus className="w-4 h-4 dark:text-gray-300" />
              </button>
            </div>
            
            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`px-6 py-2 rounded-lg transition-all duration-300 flex items-center ${
                isOutOfStock
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-green-700 hover:bg-green-800 text-white hover:scale-105'
              }`}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {isOutOfStock ? 'Agotado' : 'Agregar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardList;
