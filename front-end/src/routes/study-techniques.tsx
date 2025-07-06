import Sidebar from '@/custom-components/sidebar'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/study-techniques')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='flex'>
      <Sidebar />
      <Outlet />
    </div>
  )
}
