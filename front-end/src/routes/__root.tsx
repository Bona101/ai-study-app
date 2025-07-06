// // src/routes/__root.tsx
// import Sidebar from '@/custom-components/sidebar';
// import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

// export const Route = createRootRoute({
//   component: () => (
//     <>
//       <div className="p-2 flex gap-2">

//         <Sidebar />
//       <div>
//         <Outlet />
//         </div> {/* This is where your nested routes will render */}
//       </div>
//       <TanStackRouterDevtools /> {/* Devtools will appear in development */}
//     </>
//   ),
// });


// src/routes/__root.tsx
import Sidebar from '@/custom-components/sidebar';
import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">

        {/* <Sidebar /> */}
      <div>
        <Outlet />
        </div> {/* This is where your nested routes will render */}
      </div>
      <TanStackRouterDevtools /> {/* Devtools will appear in development */}
    </>
  ),
});