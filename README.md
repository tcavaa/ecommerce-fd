# 🛒 Modern E-Commerce Frontend

A professional, modern e-commerce frontend application built with React 19, TypeScript, and cutting-edge web technologies. This project demonstrates best practices in React development, state management, and user experience design.

## ✨ Features

### 🛍️ Core E-Commerce Functionality

- **Product Catalog**: Browse products with category filtering
- **Product Details**: Comprehensive product pages with image galleries
- **Shopping Cart**: Full cart management with persistent storage
- **Attribute Selection**: Support for product variants (size, color, etc.)
- **Order Processing**: Complete order placement workflow

### 🎨 User Experience

- **Responsive Design**: Optimized for all screen sizes
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Loading States**: Smooth loading indicators and skeleton screens
- **Error Handling**: Graceful error boundaries and user feedback
- **Keyboard Navigation**: Full keyboard accessibility support

### 🔧 Technical Excellence

- **Type Safety**: Full TypeScript implementation
- **Modern React**: Hooks, custom hooks, and functional components
- **Performance**: Optimized with lazy loading and memoization
- **Code Quality**: ESLint, Prettier, and comprehensive linting rules
- **Security**: XSS protection with DOMPurify

## 🚀 Tech Stack

### Frontend Framework

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server

### State Management & Data

- **Apollo Client** - GraphQL client with caching
- **Custom Hooks** - Modular state management
- **LocalStorage** - Persistent cart state

### Styling & UI

- **Tailwind CSS** - Utility-first CSS framework
- **Custom CSS** - Component-specific styling
- **Heroicons** - Beautiful SVG icons
- **Responsive Design** - Mobile-first approach

### Development Tools

- **ESLint** - Code linting with TypeScript rules
- **Prettier** - Code formatting
- **Husky** - Git hooks for quality assurance

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── cart/            # Cart-related components
│   ├── layout/          # Layout components (Navigation, etc.)
│   ├── product/         # Product-related components
│   └── ui/              # Generic UI components (Button, Loading, etc.)
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── constants/           # Application constants
├── graphql/             # GraphQL queries and mutations
├── styles/              # CSS files
└── assets/              # Static assets
```

## 🛠️ Installation & Setup

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)

### Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ecommerce-fd
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📜 Available Scripts

| Command              | Description                        |
| -------------------- | ---------------------------------- |
| `npm run dev`        | Start development server with HMR  |
| `npm run build`      | Build for production               |
| `npm run preview`    | Preview production build locally   |
| `npm run lint`       | Run ESLint for code quality checks |
| `npm run lint:fix`   | Fix auto-fixable ESLint issues     |
| `npm run type-check` | Run TypeScript type checking       |

## 🏗️ Architecture & Design Patterns

### Custom Hooks Pattern

- **useCart**: Manages cart state and operations
- **useOrder**: Handles order placement logic
- Separation of concerns and reusability

### Component Organization

- **Atomic Design**: Components organized by complexity
- **Feature-based**: Related components grouped together
- **Reusable UI**: Generic components for consistency

### Error Handling

- **Error Boundaries**: Catch and handle React errors
- **Graceful Degradation**: Fallback UI for failed states
- **User Feedback**: Clear error messages and recovery options

### Performance Optimizations

- **Code Splitting**: Dynamic imports for route-based splitting
- **Memoization**: React.memo and useMemo for expensive operations
- **Lazy Loading**: Images and components loaded on demand

## 🔌 API Integration

### GraphQL Endpoint

```
https://bd.rretrocar.ge/graphql
```

### Key Operations

- **Products Query**: Fetch products with filtering
- **Categories Query**: Get available categories
- **Place Order Mutation**: Submit orders

## 🎯 Best Practices Implemented

### Code Quality

- ✅ TypeScript for type safety
- ✅ ESLint with comprehensive rules
- ✅ Consistent code formatting
- ✅ Meaningful variable and function names
- ✅ Comprehensive error handling

### React Best Practices

- ✅ Functional components with hooks
- ✅ Custom hooks for logic reuse
- ✅ Proper dependency arrays
- ✅ Memoization where appropriate
- ✅ Accessibility considerations

### Performance

- ✅ Lazy loading of images
- ✅ Efficient re-renders
- ✅ Optimized bundle size
- ✅ Proper key props for lists

### Security

- ✅ XSS protection with DOMPurify
- ✅ Input validation
- ✅ Secure API communication

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Netlify

The project includes a `netlify.toml` configuration file for easy deployment to Netlify.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- Apollo team for the GraphQL client
- All open-source contributors

---

**Built with ❤️ and modern web technologies**
