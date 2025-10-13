import { ReactNode } from 'react'
import { ViewProvider } from './view'

export default function ContextProvider({ children }: { children: ReactNode }) {
  return <ViewProvider>{children}</ViewProvider>
}
