import React, { useState } from 'react';
import { ArrowLeft, User, MapPin, Phone, Mail, CreditCard, Package, CheckCircle, Store } from 'lucide-react';

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

interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
  category: string;
}

interface CheckoutPageProps {
  cartItems: CartItem[];
  onBack: () => void;
  onOrderComplete: () => void;
  user?: UserData | null;
}

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  deliveryMethod: 'delivery' | 'pickup';
  address: string;
  city: string;
  state: string;
  zipCode: string;
  paymentMethod: 'transfer' | 'cash' | 'card';
  notes: string;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cartItems, onBack, onOrderComplete, user }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [customerData, setCustomerData] = useState<CustomerData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    deliveryMethod: 'delivery',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'transfer',
    notes: ''
  });

  // Pre-fill form with user data if available
  React.useEffect(() => {
    if (user) {
      setCustomerData(prev => ({
        ...prev,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || ''
      }));
    }
  }, [user]);

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace('S/ ', ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const formatPrice = (price: number) => {
    return `S/ ${price.toFixed(2)}`;
  };

  const handleInputChange = (field: keyof CustomerData, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    return customerData.firstName && customerData.lastName && customerData.email && customerData.phone;
  };

  const validateStep2 = () => {
    if (customerData.deliveryMethod === 'pickup') {
      return true; // No need address validation for pickup
    }
    return customerData.address && customerData.city && customerData.state;
  };

  const handleSubmitOrder = () => {
    // Aquí podrías integrar con una API de pagos o enviar por WhatsApp/Email
    const order = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      total: getTotalPrice(),
      status: 'pending' as const,
      items: cartItems,
      customerData
    };
    
    // Save order to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('inversionesPoloOrders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('inversionesPoloOrders', JSON.stringify(existingOrders));
    
    console.log('Orden enviada:', order);
    setCurrentStep(4);
    
    // Simular procesamiento
    setTimeout(() => {
      onOrderComplete();
    }, 3000);
  };

  const generateWhatsAppMessage = () => {
    const total = formatPrice(getTotalPrice());
    const itemsList = cartItems.map(item => 
      `• ${item.name} x${item.quantity} - ${item.price}`
    ).join('\n');
    
    const deliveryInfo = customerData.deliveryMethod === 'pickup' 
      ? '🏪 *RECOJO EN TIENDA*\nAv. Principal, Centro Comercial Plaza, Local 25'
      : `📍 *Dirección de Entrega:*\n${customerData.address}\n${customerData.city}, ${customerData.state} ${customerData.zipCode}`;
    
    const message = `🛒 *NUEVO PEDIDO - INVERSIONES POLO*

👤 *Datos del Cliente:*
Nombre: ${customerData.firstName} ${customerData.lastName}
Email: ${customerData.email}
Teléfono: ${customerData.phone}

${deliveryInfo}

🛍️ *Productos:*
${itemsList}

💰 *Total: ${total}*

💳 *Método de Pago:* ${customerData.paymentMethod === 'transfer' ? 'Transferencia' : customerData.paymentMethod === 'cash' ? 'Efectivo' : 'Tarjeta'}

📝 *Notas:* ${customerData.notes || 'Ninguna'}`;

    return encodeURIComponent(message);
  };

  if (currentStep === 4) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Pedido Confirmado!</h2>
          <p className="text-gray-600 mb-6">
            Hemos recibido tu pedido. Te contactaremos pronto para coordinar la entrega.
          </p>
          <div className="space-y-3">
            <a
              href={`https://wa.me/51987654321?text=${generateWhatsAppMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors block"
            >
              Enviar por WhatsApp
            </a>
            <button
              onClick={onBack}
              className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg font-medium transition-colors"
            >
              Volver a la Tienda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-green-700 hover:text-green-800 font-medium mr-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver al Carrito
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Finalizar Compra</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                <span className={`ml-2 font-medium ${
                  currentStep >= step ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step === 1 ? 'Datos Personales' : step === 2 ? 'Dirección' : 'Confirmación'}
                </span>
                {step < 3 && <div className="w-16 h-0.5 bg-gray-300 ml-4"></div>}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div>
                  <div className="flex items-center mb-6">
                    <User className="w-6 h-6 text-green-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">Información Personal</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        value={customerData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Tu nombre"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apellido *
                      </label>
                      <input
                        type="text"
                        value={customerData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Tu apellido"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={customerData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="tu@email.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        value={customerData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="+58 424-123-4567"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setCurrentStep(2)}
                      disabled={!validateStep1()}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Address */}
              {currentStep === 2 && (
                <div>
                  <div className="flex items-center mb-6">
                    <MapPin className="w-6 h-6 text-green-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">Método de Entrega</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Delivery Method Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        ¿Cómo prefieres recibir tu pedido? *
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name="deliveryMethod"
                            value="delivery"
                            checked={customerData.deliveryMethod === 'delivery'}
                            onChange={(e) => handleInputChange('deliveryMethod', e.target.value)}
                            className="mt-1 mr-3"
                          />
                          <div>
                            <div className="font-medium text-gray-900 flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-green-600" />
                              Entrega a Domicilio
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              Entregamos en tu dirección - Gratis
                            </div>
                          </div>
                        </label>
                        
                        <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name="deliveryMethod"
                            value="pickup"
                            checked={customerData.deliveryMethod === 'pickup'}
                            onChange={(e) => handleInputChange('deliveryMethod', e.target.value)}
                            className="mt-1 mr-3"
                          />
                          <div>
                            <div className="font-medium text-gray-900 flex items-center">
                              <Package className="w-4 h-4 mr-2 text-green-600" />
                              Recojo en Tienda
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              Retira en nuestra tienda física
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Store Information for Pickup */}
                    {customerData.deliveryMethod === 'pickup' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          Información de la Tienda
                        </h4>
                        <div className="text-sm text-green-700 space-y-1">
                          <p><strong>Dirección:</strong> Av. Principal, Centro Comercial Plaza, Local 25</p>
                          <p><strong>Horarios:</strong></p>
                          <ul className="ml-4 space-y-1">
                            <li>• Lunes - Viernes: 8:00 AM - 6:00 PM</li>
                            <li>• Sábados: 9:00 AM - 5:00 PM</li>
                            <li>• Domingos: 10:00 AM - 2:00 PM</li>
                          </ul>
                          <p><strong>Teléfono:</strong> +51 987-654-321</p>
                          <p className="mt-2 font-medium">
                            💡 Te contactaremos cuando tu pedido esté listo para recoger
                          </p>
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dirección Completa *
                      </label>
                      <input
                        type="text"
                        value={customerData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Av. Principal, Edificio, Apartamento, etc."
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ciudad *
                        </label>
                        <input
                          type="text"
                          value={customerData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Tu ciudad"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Estado *
                        </label>
                        <input
                          type="text"
                          value={customerData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Tu estado"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Código Postal
                        </label>
                        <input
                          type="text"
                          value={customerData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="1234"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Atrás
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      disabled={!validateStep2()}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment & Confirmation */}
              {currentStep === 3 && (
                <div>
                  <div className="flex items-center mb-6">
                    <CreditCard className="w-6 h-6 text-green-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">Método de Pago</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Selecciona tu método de pago preferido:
                      </label>
                      <div className="space-y-3">
                        {[
                          { value: 'transfer', label: 'Transferencia Bancaria', desc: 'Pago por transferencia o Pago Móvil' },
                          { value: 'cash', label: 'Efectivo', desc: 'Pago en efectivo al recibir el producto' },
                          { value: 'card', label: 'Tarjeta', desc: 'Pago con tarjeta de débito/crédito' }
                        ].map((method) => (
                          <label key={method.value} className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method.value}
                              checked={customerData.paymentMethod === method.value}
                              onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                              className="mt-1 mr-3"
                            />
                            <div>
                              <div className="font-medium text-gray-900">{method.label}</div>
                              <div className="text-sm text-gray-600">{method.desc}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Address fields - only show for delivery */}
                    {customerData.deliveryMethod === 'delivery' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Dirección Completa *
                          </label>
                          <input
                            type="text"
                            value={customerData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Av. Principal, Edificio, Apartamento, etc."
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Ciudad *
                            </label>
                            <input
                              type="text"
                              value={customerData.city}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Tu ciudad"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Estado *
                            </label>
                            <input
                              type="text"
                              value={customerData.state}
                              onChange={(e) => handleInputChange('state', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Tu estado"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Código Postal
                            </label>
                            <input
                              type="text"
                              value={customerData.zipCode}
                              onChange={(e) => handleInputChange('zipCode', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="1234"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notas adicionales (opcional)
                      </label>
                      <textarea
                        value={customerData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Instrucciones especiales, referencias de ubicación, etc."
                      />
                    </div>
                  </div>
            
                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Atrás
                    </button>
                    <button
                      onClick={handleSubmitOrder}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Confirmar Pedido
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Resumen del Pedido
              </h3>
              
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                      <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-green-600">{item.price}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">
                    {customerData?.deliveryMethod === 'pickup' ? 'Recojo en tienda:' : 'Envío:'}
                  </span>
                  <span className="font-semibold text-green-600">Gratis</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-xl font-bold text-green-600">{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;