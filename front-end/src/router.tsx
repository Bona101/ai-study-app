// src/router.tsx
import { Outlet, Router, Route, RootRoute, redirect } from '@tanstack/react-router';
import { AuthProvider, useAuth } from './AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './custom-components/login';
import Signup from './custom-components/signup';
import ForgotPassword from './custom-components/forgot-password';
import ResetPassword from './custom-components/reset-password';
import Dashboard from './custom-components/dashboard';
import App from './App';
import { type RouterContext } from './types'; // Import RouterContext type

const queryClient = new QueryClient();

// Create a root route with a context type
const rootRoute = new RootRoute({
  component: () => (
    // AuthProvider is outside the RouterProvider because useAuth is called in AppWrapper which wraps RouterProvider
    // The context is passed to RouterProvider explicitly from AppWrapper
    <QueryClientProvider client={queryClient}>
      <Outlet />
      {/* Optional: Devtools for TanStack Router */}
      {/* <Suspense fallback={null}>
        <TanStackRouterDevtools />
      </Suspense> */}
    </QueryClientProvider>
  ),
});

// Define a type for route loaders that return the auth context
type AuthLoaderContext = { auth: RouterContext['auth'] };

// Login Route
const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
  beforeLoad: ({ context }) => { // context is implicitly typed by the Router<T> configuration
    const { auth } = context as RouterContext; // Cast context to our defined RouterContext
    if (auth.isAuthenticated) {
      throw redirect({ to: '/dashboard' });
    }
  },
  loader: ({ context }): AuthLoaderContext => ({ auth: (context as RouterContext).auth }),
});

// Signup Route
const signupRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: Signup,
  beforeLoad: ({ context }) => {
    const { auth } = context as RouterContext;
    if (auth.isAuthenticated) {
      throw redirect({ to: '/dashboard' });
    }
  },
  loader: ({ context }): AuthLoaderContext => ({ auth: (context as RouterContext).auth }),
});

// Forgot Password Route
const forgotPasswordRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: ForgotPassword,
  beforeLoad: ({ context }) => {
    const { auth } = context as RouterContext;
    if (auth.isAuthenticated) {
      throw redirect({ to: '/dashboard' });
    }
  },
  loader: ({ context }): AuthLoaderContext => ({ auth: (context as RouterContext).auth }),
});

// Reset Password Route (dynamic segment for token)
const resetPasswordRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/reset-password/$token', // Match the backend URL structure
  component: ResetPassword,
  beforeLoad: ({ context }) => {
    const { auth } = context as RouterContext;
    if (auth.isAuthenticated) {
      throw redirect({ to: '/dashboard' });
    }
  },
  loader: ({ context }): AuthLoaderContext => ({ auth: (context as RouterContext).auth }),
});


// Protected Route (Example: Dashboard)
const dashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: Dashboard,
  // Protection logic:
  beforeLoad: ({ context }) => {
    const { auth } = context as RouterContext;
    if (!auth.isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
  // Add auth context to loader for components to consume
  loader: ({ context }): AuthLoaderContext => ({ auth: (context as RouterContext).auth }),
});

// Main app route (root index route)
const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App, // Your main App component where Gemini interaction could happen
  beforeLoad: ({ context }) => {
    // Optionally redirect to login if not authenticated on the root page
    // const { auth } = context as RouterContext;
    // if (!auth.isAuthenticated) {
    //   throw redirect({ to: '/login' });
    // }
  },
  loader: ({ context }): AuthLoaderContext => ({ auth: (context as RouterContext).auth }),
});


// Combine routes into a tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
  dashboardRoute,
]);

// Create the router instance and provide the context type
export const router = new Router({
  routeTree,
  // Add a context provider for the auth.
  // The `undefined` here ensures it's initialized, and it will be replaced by AppWrapper.
  context: {
    auth: undefined!, // Use non-null assertion as it will be provided in main.tsx
  },
});

// This enables type-safe routing with `useRouter` and `useRoute` hooks.
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}