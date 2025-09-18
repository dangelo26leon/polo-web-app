import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, UserPlus, LogIn } from 'lucide-react';

interface AuthPageProps {
  onBack: () => void;
  onLogin: (userData: UserData) => void;
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

const AuthPage: React.FC<AuthPageProps> = ({ onBack, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!isLogin) {
      if (!formData.firstName) {
        newErrors.firstName = 'El nombre es requerido';
      }
      if (!formData.lastName) {
        newErrors.lastName = 'El apellido es requerido';
      }
      if (!formData.phone) {
        newErrors.phone = 'El teléfono es requerido';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (isLogin) {
        // Login logic
        const existingUsers = JSON.parse(localStorage.getItem('inversionesPoloUsers') || '[]');
        const user = existingUsers.find((u: any) => u.email === formData.email);
        
        if (user && user.password === formData.password) {
          const userData: UserData = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            address: user.address,
            city: user.city,
            state: user.state,
            zipCode: user.zipCode
          };
          onLogin(userData);
        } else {
          setErrors({ email: 'Credenciales inválidas' });
        }
      } else {
        // Register logic
        const newUser = {
          id: Date.now().toString(),
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          createdAt: new Date().toISOString()
        };

        const existingUsers = JSON.parse(localStorage.getItem('inversionesPoloUsers') || '[]');
        
        // Check if user already exists
        if (existingUsers.find((u: any) => u.email === formData.email)) {
          setErrors({ email: 'Este email ya está registrado' });
          setIsLoading(false);
          return;
        }

        existingUsers.push(newUser);
        localStorage.setItem('inversionesPoloUsers', JSON.stringify(existingUsers));

        const userData: UserData = {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          phone: newUser.phone
        };
        onLogin(userData);
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <button
            onClick={onBack}
            className="flex items-center text-green-700 hover:text-green-800 font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </button>
          
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-green-700 rounded-full flex items-center justify-center">
              {isLogin ? <LogIn className="h-6 w-6 text-white" /> : <UserPlus className="h-6 w-6 text-white" />}
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                  setFormData({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    firstName: '',
                    lastName: '',
                    phone: ''
                  });
                }}
                className="ml-1 font-medium text-green-600 hover:text-green-500"
              >
                {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
              </button>
            </p>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      Nombre
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`appearance-none relative block w-full px-3 py-2 pl-10 border ${
                          errors.firstName ? 'border-red-300' : 'border-gray-300'
                        } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500`}
                        placeholder="Tu nombre"
                      />
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                    {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Apellido
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={`appearance-none relative block w-full px-3 py-2 pl-10 border ${
                          errors.lastName ? 'border-red-300' : 'border-gray-300'
                        } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500`}
                        placeholder="Tu apellido"
                      />
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                    {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Teléfono
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`appearance-none relative block w-full px-3 py-2 border ${
                        errors.phone ? 'border-red-300' : 'border-gray-300'
                      } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500`}
                      placeholder="+51 987-654-321"
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`appearance-none relative block w-full px-3 py-2 pl-10 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500`}
                  placeholder="tu@email.com"
                />
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`appearance-none relative block w-full px-3 py-2 pl-10 pr-10 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500`}
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmar Contraseña
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`appearance-none relative block w-full px-3 py-2 pl-10 border ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Procesando...
                </div>
              ) : (
                <>
                  {isLogin ? <LogIn className="h-4 w-4 mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
                  {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </>
              )}
            </button>
          </div>

          {isLogin && (
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-green-600 hover:text-green-500"
                onClick={() => {
                  // Demo credentials
                  setFormData({
                    ...formData,
                    email: 'demo@inversionespolo.pe',
                    password: 'demo123'
                  });
                }}
              >
                Usar credenciales de demo
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthPage;