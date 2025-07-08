import { createFileRoute } from '@tanstack/react-router'
import Start from "@/custom-components/start"

export const Route = createFileRoute('/start')({
  component: Start,
})
