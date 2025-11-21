import React from "react";
import ProductCard from "./ProductCard";
import { Heart, ArrowLeft } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  rating: number;
  category: string;
  description?: string;
}

interface FavoritesPageProps {
  allProducts: Product[];
  favorites: number[];
  onAddToCart: (product: Product, quantity: number) => void;
  onToggleFavorite: (productId: number) => void;
  onBack: () => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({
  allProducts,
  favorites,
  onAddToCart,
  onToggleFavorite,
  onBack,
}) => {
  // Filtramos solo los productos que están en la lista de favoritos
  const favoriteProducts = allProducts.filter(product => favorites.includes(product.id));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Encabezado de la página */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium mr-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </button>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Mis Favoritos</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
              Aquí están los productos que más te gustan.
            </p>
          </div>
        </div>

        {/* Grid de productos favoritos */}
        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onToggleFavorite={onToggleFavorite}
                isFavorite={true} // Siempre será favorito en esta página
              />
            ))}
          </div>
        ) : (
          // Mensaje si no hay favoritos
          <div className="text-center py-16">
            <Heart className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Aún no tienes favoritos
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Haz clic en el corazón de un producto para guardarlo aquí.
            </p>
            <button
              onClick={onBack}
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Explorar Productos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;