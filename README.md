# React E-Commerce Frontend

This project is a modern e-commerce frontend application built with React, TypeScript, and Vite. It allows users to browse products by category, view product details, manage a shopping cart, and simulate placing an order.

## Key Features

* Product listing with category filtering
* Detailed product view page with image gallery and attribute selection
* Shopping cart functionality:
    * Add products to cart (with selected attributes)
    * Update item quantities in cart
    * Remove items from cart
    * Cart data persists in `localStorage`
* Order placement simulation
* Responsive design for various screen sizes.
* Sanitized HTML for product descriptions to prevent XSS.

## Tech Stack

* **Framework/Library:** React 19
* **Language:** TypeScript
* **Build Tool:** Vite
* **State Management:** React Hooks (`useState`, `useEffect`)
* **Routing:** React Router DOM
* **GraphQL Client:** Apollo Client
* **Styling:** Tailwind CSS, Custom CSS
* **UI Components:** Heroicons (dependency)
* **Security:** DOMPurify for HTML sanitization
* **Linting:** ESLint with TypeScript support

## Prerequisites

* Node.js (e.g., v18.x or later)
* npm (usually comes with Node.js)

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd ecommerce-fd
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
   

## Available Scripts

In the project directory, you can run:

* **`npm run dev`**
    Starts the development server with Hot Module Replacement (HMR).
    Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal) to view it in the browser.

* **`npm run build`**
    Builds the app for production to the `dist` folder.
    It correctly bundles React in production mode and optimizes the build for the best performance.

* **`npm run lint`**
    Lints the codebase using ESLint to check for code quality and style issues.

* **`npm run preview`**
    Serves the production build from the `dist` folder locally to preview the app as it would appear in production.

## API Endpoint

This application fetches data from the following GraphQL API endpoint:
`https://bd.rretrocar.ge/graphql`

## ESLint Configuration Notes

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh (This project uses `@vitejs/plugin-react-swc`)

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
// eslint.config.js
import tseslint from 'typescript-eslint';

export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    // ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    // ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
  // ... other configurations
});