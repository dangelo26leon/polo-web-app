# 🛒 Inversiones Polo - E-Commerce Web App

<div align="center">

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.17-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

**Tienda online de electrodomésticos y tecnología con diseño moderno y responsive**

[Demo en Vivo](#) • [Reportar Bug](../../issues) • [Solicitar Feature](../../issues)

</div>

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Funcionalidades](#-funcionalidades)
- [Convenciones de Git](#-convenciones-de-git)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## ✨ Características

- 🌓 **Modo Oscuro/Claro** - Tema adaptable con persistencia en localStorage
- 🛒 **Carrito de Compras** - Gestión completa con animaciones y stock en tiempo real
- ❤️ **Lista de Favoritos** - Guarda tus productos favoritos
- 🔍 **Búsqueda Avanzada** - Filtros por precio, categoría, rating y disponibilidad
- 📱 **Diseño Responsive** - Optimizado para móviles, tablets y desktop
- 🎠 **Carrusel Hero** - Banners promocionales con autoplay
- 📊 **Vista Grid/Lista** - Alterna entre diferentes modos de visualización
- ⚡ **Skeleton Loading** - Indicadores de carga elegantes
- 👤 **Autenticación** - Sistema de login/registro con persistencia
- 🔔 **Notificaciones Toast** - Feedback visual para acciones del usuario

---

## 📸 Capturas de Pantalla

<div align="center">

| Modo Claro | Modo Oscuro |
|:----------:|:-----------:|
| ![Light Mode](images/screenshot-light.png) | ![Dark Mode](images/screenshot-dark.png) |

</div>

---

## 🛠️ Tecnologías

### Frontend Principal
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| React | 18.3.1 | Biblioteca UI con Hooks |
| TypeScript | 5.6 | Tipado estático |
| Vite | 5.4 | Build tool y dev server |

### Estilos y UI
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| Tailwind CSS | 3.4.17 | Framework CSS utility-first |
| Lucide React | 0.344.0 | Iconografía moderna |
| PostCSS | 8.x | Procesador CSS |

### Calidad de Código
| Tecnología | Descripción |
|------------|-------------|
| ESLint | Linting y buenas prácticas |
| TypeScript ESLint | Reglas específicas para TS |

---

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+ 
- npm, yarn o pnpm

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/dangelo26leon/polo-web-app.git
   cd polo-web-app
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   # o
   pnpm install
   ```

3. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

### Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Genera build de producción |
| `npm run preview` | Preview del build de producción |
| `npm run lint` | Ejecuta ESLint |

---

## 📁 Estructura del Proyecto

```
polo-web-app/
├── 📂 images/                  # Imágenes de productos y banners
├── 📂 src/
│   ├── 📂 components/
│   │   ├── AuthPage.tsx        # Página de login/registro
│   │   ├── Cart.tsx            # Componente del carrito
│   │   ├── CheckoutPage.tsx    # Proceso de checkout
│   │   ├── FavoritePage.tsx    # Lista de favoritos
│   │   ├── Header.tsx          # Navegación principal
│   │   ├── HeroCarousel.tsx    # Carrusel de banners
│   │   ├── ProductCard.tsx     # Tarjeta de producto (grid)
│   │   ├── ProductCardList.tsx # Tarjeta de producto (lista)
│   │   ├── ProductsPage.tsx    # Catálogo de productos
│   │   ├── SearchFilter.tsx    # Búsqueda y filtros
│   │   ├── SkeletonCard.tsx    # Loading placeholder
│   │   ├── Toast.tsx           # Notificaciones
│   │   └── UserProfile.tsx     # Perfil de usuario
│   ├── 📂 data/
│   │   └── Products.json       # Inventario de productos
│   ├── App.tsx                 # Componente principal
│   ├── main.tsx                # Entry point
│   └── index.css               # Estilos globales y animaciones
├── index.html
├── tailwind.config.js          # Configuración de Tailwind
├── vite.config.ts              # Configuración de Vite
├── tsconfig.json               # Configuración de TypeScript
└── package.json
```

---

## 🎯 Funcionalidades

### 🛒 Gestión de Carrito
- Agregar/eliminar productos con cantidad personalizada
- Control de stock en tiempo real
- Animación de rebote al agregar productos
- Persistencia en localStorage

### 🔍 Sistema de Búsqueda
- Búsqueda por nombre de producto
- Historial de búsquedas recientes
- Filtros avanzados:
  - 💰 Rango de precios
  - ⭐ Rating mínimo
  - 📦 Disponibilidad de stock

### 👤 Autenticación
- Registro de nuevos usuarios
- Login con validación
- Persistencia de sesión
- Perfil de usuario editable

### 🎨 Experiencia de Usuario
- Transiciones suaves entre páginas
- Animaciones CSS personalizadas
- Skeleton loading para mejor UX
- Toast notifications para feedback

---

## 📜 Convenciones de Git

Utilizamos **Commits Semánticos** para un historial limpio y descriptivo:

| Prefijo | Descripción | Ejemplo |
|---------|-------------|---------|
| `feat:` | Nueva funcionalidad | `feat: agregar filtro por precio` |
| `fix:` | Corrección de bug | `fix: corregir cálculo del total` |
| `style:` | Cambios de estilo/CSS | `style: mejorar dark mode` |
| `refactor:` | Refactorización | `refactor: optimizar búsqueda` |
| `docs:` | Documentación | `docs: actualizar README` |
| `chore:` | Tareas de mantenimiento | `chore: actualizar dependencias` |

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit con mensaje semántico (`git commit -m 'feat: agregar nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">

**Desarrollado con ❤️ por [Inversiones Polo](https://github.com/dangelo26leon)**

⭐ ¡Dale una estrella si te fue útil! ⭐

</div>