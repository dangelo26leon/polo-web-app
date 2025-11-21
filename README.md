## Electrodomesticos-polo

Proyecto de electrodomesticos con funcion de compra
en donde esta orientado a los clientes en cualquier dispositivo movil

## 🛠️ Instalación y Configuración

1.  Clonar el repositorio:
    ```bash
    git clone [https://www.youtube.com/watch?v=GtN6N11qSgA](https://www.youtube.com/watch?v=GtN6N11qSgA)
    ```
2.  Instalar dependencias (usa npm, yarn o pnpm):
    ```bash
    npm install
    ```
3.  Ejecutar el proyecto en modo desarrollo (Vite):
    ```bash
    npm run dev
    ```
    
## 📜 Convenciones de Git

Utilizamos el enfoque de Commits Semánticos (Semantic Commits) para un historial limpio:
-   **feat:** (Nueva funcionalidad)
-   **fix:** (Corrección de un bug)
-   **style:** (Cambios de formato, CSS)
-   **refactor:** (Refactorización de código sin cambiar la funcionalidad)
-   **merge:** (Resolución de conflictos, como se demostró en el Avance 3)
-   **docs:** (Documentación del proyecto)

## 📁 Estructura Principal del Código

-   `src/components/`: Componentes reutilizables (Botones, Inputs, Toggles).
-   `src/data/`: Archivos JSON con datos estáticos (Inventario de Productos).
-   `src/pages/`: Vistas de alto nivel (aunque actualmente están en `components`, puedes renombrar los principales si lo deseas, o simplemente explicar que las vistas principales están en `components`).
-   `public/images/`: Recursos de imágenes como el logo.


## Tecnologías y Dependencias

El proyecto está construido sobre el ecosistema moderno de React:

Frontend Principal: React v18.3.1 con Hooks y TypeScript (TSX).

Build Tool: Vite (para el entorno de desarrollo y empaquetado final).

Estilos: Tailwind CSS (v3.4.17) para un desarrollo rápido y responsive, configurado con darkMode: 'class'.

Iconografía: Lucide-React (v0.344.0).

Manejo de Código: ESLint (para calidad de código y buenas prácticas, incluyendo React Hooks).

Persistencia: Uso de localStorage para el estado del carrito, favoritos, usuario, historial de búsqueda y tema.