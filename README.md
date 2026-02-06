# Minisource Frontend Template

A modern, production-ready Next.js 15 template with shadcn/ui, TypeScript, and best practices for building scalable web applications.

## Features

- **Next.js 15** - Latest App Router with React Server Components
- **React 19** - Latest React with improved performance
- **TypeScript** - Type-safe code with strict configuration
- **shadcn/ui** - Beautiful, accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
- **TanStack Query** - Powerful data fetching and caching
- **Zustand** - Lightweight state management
- **React Hook Form + Zod** - Form handling with validation
- **Vitest** - Fast unit testing
- **Docker** - Production-ready containerization
- **GitHub Actions** - CI/CD pipeline

## Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher (or yarn/pnpm)

### Installation

1. **Clone the template**
   ```bash
   git clone https://github.com/minisource/front-template.git my-app
   cd my-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.development.local
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
front-template/
├── .github/                    # GitHub Actions workflows
│   └── workflows/
│       ├── ci.yml              # CI pipeline
│       └── deploy.yml          # Production deployment
├── public/                     # Static assets
│   ├── manifest.json           # PWA manifest
│   └── robots.txt              # SEO robots file
├── src/
│   ├── api/                    # API layer (separated from UI)
│   │   ├── client.ts           # Axios client configuration
│   │   ├── base.ts             # Base API class
│   │   ├── index.ts            # API exports
│   │   └── services/           # API service modules
│   │       ├── auth.ts         # Authentication API
│   │       └── user.ts         # User API
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth route group
│   │   │   ├── login/          # Login page
│   │   │   └── register/       # Register page
│   │   ├── (main)/             # Main app route group
│   │   │   └── dashboard/      # Dashboard page
│   │   ├── api/                # API routes
│   │   │   └── health/         # Health check endpoint
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── not-found.tsx       # 404 page
│   │   ├── error.tsx           # Error boundary
│   │   └── loading.tsx         # Loading state
│   ├── components/             # React components
│   │   ├── layout/             # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   └── sidebar.tsx
│   │   ├── providers/          # Context providers
│   │   │   └── index.tsx       # App providers wrapper
│   │   └── ui/                 # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── ...
│   ├── config/                 # Configuration files
│   │   ├── index.ts            # App configuration
│   │   └── constants.ts        # Constants & query keys
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-auth.ts         # Authentication hooks
│   │   ├── use-debounce.ts     # Debounce hook
│   │   ├── use-local-storage.ts
│   │   ├── use-media-query.ts
│   │   └── index.ts
│   ├── lib/                    # Utility libraries
│   │   └── utils.ts            # Helper functions
│   ├── stores/                 # Zustand stores
│   │   ├── auth.store.ts       # Auth state
│   │   ├── ui.store.ts         # UI state
│   │   └── index.ts
│   ├── styles/                 # Global styles
│   │   └── globals.css         # Tailwind + custom CSS
│   ├── types/                  # TypeScript types
│   │   ├── common.ts           # Common types
│   │   └── index.ts
│   └── __tests__/              # Test files
│       └── setup.ts            # Test setup
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── .prettierrc                 # Prettier configuration
├── components.json             # shadcn/ui configuration
├── docker-compose.yml          # Production Docker Compose
├── docker-compose.dev.yml      # Development Docker Compose
├── Dockerfile                  # Production Dockerfile
├── Dockerfile.dev              # Development Dockerfile
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies & scripts
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── vitest.config.ts            # Vitest configuration
```

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run dev:turbo    # Start with Turbopack

# Build
npm run build        # Create production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format with Prettier
npm run format:check # Check formatting
npm run type-check   # Run TypeScript check

# Testing
npm run test         # Run tests
npm run test:coverage # Run tests with coverage

# Docker
npm run docker:build # Build Docker image
npm run docker:dev   # Start development container
npm run docker:prod  # Start production container
```

## Adding shadcn/ui Components

This template is pre-configured for shadcn/ui. Add components using:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
# etc.
```

Components will be added to `src/components/ui/`.

## API Layer

The API layer is separated from the UI for clean architecture:

### Creating an API Service

```typescript
// src/api/services/products.ts
import { api } from '../client';
import { BaseApi } from '../base';

interface Product {
  id: string;
  name: string;
  price: number;
}

class ProductApi extends BaseApi {
  constructor() {
    super('/products');
  }

  async getAll(): Promise<Product[]> {
    return api.get<Product[]>(this.url());
  }

  async getById(id: string): Promise<Product> {
    return api.get<Product>(this.url(`/${id}`));
  }
}

export const productApi = new ProductApi();
```

### Using with React Query

```typescript
// src/hooks/use-products.ts
import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/api';
import { QUERY_KEYS, CACHE_TIME } from '@/config/constants';

export function useProducts() {
  return useQuery({
    queryKey: QUERY_KEYS.products.all,
    queryFn: () => productApi.getAll(),
    staleTime: CACHE_TIME.MEDIUM,
  });
}
```

## State Management

Using Zustand for global state:

```typescript
// src/stores/cart.store.ts
import { create } from 'zustand';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ 
    items: [...state.items, item] 
  })),
  removeItem: (id) => set((state) => ({ 
    items: state.items.filter((i) => i.id !== id) 
  })),
  clearCart: () => set({ items: [] }),
}));
```

## Docker Deployment

### Development

```bash
docker-compose -f docker-compose.dev.yml up
```

### Production

```bash
# Build and start
docker-compose up -d

# With custom environment
NEXT_PUBLIC_API_URL=https://api.example.com docker-compose up -d
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_NAME` | Application name | Minisource App |
| `NEXT_PUBLIC_APP_URL` | Application URL | http://localhost:3000 |
| `NEXT_PUBLIC_API_URL` | Backend API URL | http://localhost:8080/api |
| `NEXT_PUBLIC_API_TIMEOUT` | API timeout (ms) | 30000 |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Enable analytics | false |
| `NEXT_PUBLIC_ENABLE_PWA` | Enable PWA features | false |

## Best Practices

### Code Organization

1. **Single Responsibility** - Each file/component has one purpose
2. **Separation of Concerns** - API, UI, and state are separate
3. **Colocation** - Keep related files together
4. **Type Safety** - Use TypeScript strictly

### Component Structure

```typescript
// Good component structure
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  return (
    <button 
      className={cn(baseStyles, variantStyles[variant])}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### File Naming

- Components: `PascalCase.tsx` or `kebab-case.tsx`
- Hooks: `use-hook-name.ts`
- Utilities: `kebab-case.ts`
- Stores: `name.store.ts`
- Types: `name.types.ts`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Links

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [TanStack Query](https://tanstack.com/query)
- [Zustand](https://zustand-demo.pmnd.rs)
