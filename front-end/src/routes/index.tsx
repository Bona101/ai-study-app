// src/routes/index.tsx
import { createFileRoute, redirect } from '@tanstack/react-router';


export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: '/study-techniques' }); // Redirect to your desired new route
  },
});

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
    </div>
  );
}




