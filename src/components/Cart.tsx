import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
  category: string;
  stock: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  user?: UserData | null;
}

const Cart: React.FC<CartProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart,
  onProceedToCheckout,
  user
}) => {

  // Convierte "S/ 1,299.00" a número
  const parsePrice = (price: string) => {
    const clean = price
      .replace('S/', '')
      .replace('S/.', '')
      .replace('s/', '')
      .replace(',', '')
      .trim();
    const value = parseFloat(clean);
    return isNaN(value) ? 0 : value;
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const price = parsePrice(item.price);
      return total + price * item.quantity;
    }, 0);
  };

  const formatPrice = (price: number) => {
    return `S/ ${price.toFixed(2)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Carrito de Compras
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Tu carrito está vacío</p>
                <button 
                  onClick={onClose}
                  className="mt-4 text-green-700 hover:text-green-800 font-medium"
                >
                  Continuar comprando
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => {
                  const isOutOfStock = item.stock === 0;
                  const nearLimit = item.stock > 0 && item.stock <= 3;

                  let stockText = '';
                  let stockColor = '';

                  if (isOutOfStock) {
                    stockText = 'Sin stock disponible';
                    stockColor = 'text-red-600 dark:text-red-400';
                  } else if (nearLimit) {
                    stockText = `Últimas ${item.stock} unidades`;
                    stockColor = 'text-orange-600 dark:text-orange-400';
                  } else {
                    stockText = `Stock: ${item.stock}`;
                    stockColor = 'text-green-700 dark:text-green-400';
                  }

                  return (
                    <div
                      key={item.id}
                      className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                    >
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {item.category}
                        </p>
                        <p className="text-green-700 font-semibold">
                          {item.price}
                        </p>
                        <p className={`text-xs mt-1 ${stockColor}`}>
                          {stockText}
                        </p>
                        
                        <div className="flex items-center mt-2">
                          <button 
                            onClick={() =>
                              onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                            }
                            disabled={item.quantity <= 1}
                            className={`p-1 rounded transition-colors ${
                              item.quantity <= 1
                                ? 'opacity-40 cursor-not-allowed'
                                : 'hover:bg-gray-200'
                            }`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-sm">{item.quantity}</span>
                          <button 
                            onClick={() =>
                              onUpdateQuantity(
                                item.id,
                                Math.min(item.stock, item.quantity + 1)
                              )
                            }
                            disabled={item.quantity >= item.stock || isOutOfStock}
                            className={`p-1 rounded transition-colors ${
                              item.quantity >= item.stock || isOutOfStock
                                ? 'opacity-40 cursor-not-allowed'
                                : 'hover:bg-gray-200'
                            }`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t dark:border-gray-700 p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold dark:text-white">Total:</span>
                <span className="text-xl font-bold text-green-700">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>
              
              <div className="space-y-2">
                <button 
                  onClick={onProceedToCheckout}
                  className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  {user ? 'Proceder al Pago' : 'Iniciar Sesión para Comprar'}
                </button>
                <button 
                  onClick={onClearCart}
                  className="w-full border border-red-500 text-red-500 hover:bg-red-50 py-2 rounded-lg font-medium transition-colors"
                >
                  Vaciar Carrito
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
