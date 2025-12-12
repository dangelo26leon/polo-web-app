import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  bgGradient: string;
  icon?: string;
}

interface HeroCarouselProps {
  userName?: string;
  onViewProducts: () => void;
  onContact: () => void;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ 
  userName, 
  onViewProducts, 
  onContact 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const banners: Banner[] = [
    {
      id: 1,
      title: userName ? `¡Bienvenido ${userName}!` : 'Bienvenidos a Inversiones Polo',
      subtitle: 'Tu tienda de confianza para electrodomésticos y tecnología',
      buttonText: 'Ver Productos',
      bgGradient: 'from-green-800 to-green-600 dark:from-green-900 dark:to-green-700',
      icon: '🏠'
    },
    {
      id: 2,
      title: '🔥 Ofertas Especiales',
      subtitle: 'Hasta 30% de descuento en electrodomésticos seleccionados',
      buttonText: 'Ver Ofertas',
      bgGradient: 'from-orange-600 to-red-600 dark:from-orange-700 dark:to-red-700',
      icon: '🏷️'
    },
    {
      id: 3,
      title: '📦 Envío Gratis',
      subtitle: 'En compras mayores a S/200 dentro de Nuevo Chimbote',
      buttonText: 'Comprar Ahora',
      bgGradient: 'from-blue-700 to-indigo-700 dark:from-blue-800 dark:to-indigo-800',
      icon: '🚚'
    },
    {
      id: 4,
      title: '⚡ Nuevos Productos',
      subtitle: 'Descubre lo último en tecnología y electrodomésticos',
      buttonText: 'Explorar',
      bgGradient: 'from-purple-700 to-pink-600 dark:from-purple-800 dark:to-pink-700',
      icon: '✨'
    }
  ];

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, banners.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section id="inicio" className="relative overflow-hidden">
      {/* Slides Container */}
      <div 
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className={`min-w-full bg-gradient-to-r ${banner.bgGradient} text-white`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="text-center">
                <h1 className="text-4xl sm:text-5xl font-bold mb-6 animate-fadeIn">
                  {banner.title}
                </h1>
                <p className="text-xl sm:text-2xl mb-8 text-white/90 animate-fadeIn animation-delay-200">
                  {banner.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn animation-delay-400">
                  <button
                    onClick={onViewProducts}
                    className="bg-white text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    {banner.buttonText}
                  </button>
                  <button
                    onClick={onContact}
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300"
                  >
                    Contactar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hidden sm:block"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hidden sm:block"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div 
          className="h-full bg-white transition-all duration-300"
          style={{ 
            width: `${((currentSlide + 1) / banners.length) * 100}%`,
            transition: isAutoPlaying ? 'width 5s linear' : 'width 0.3s ease'
          }}
        />
      </div>
    </section>
  );
};

export default HeroCarousel;
