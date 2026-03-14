import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface AuthBackContextType {
  onBack: (() => void) | null
  setOnBack: (fn: (() => void) | null) => void
}

const AuthBackContext = createContext<AuthBackContextType>({
  onBack: null,
  setOnBack: () => {},
})

export function AuthBackProvider({ children }: { children: ReactNode }) {
  const [onBack, setOnBackState] = useState<(() => void) | null>(null)

  const setOnBack = useCallback((fn: (() => void) | null) => {
    setOnBackState(() => fn)
  }, [])

  return (
    <AuthBackContext.Provider value={{ onBack, setOnBack }}>
      {children}
    </AuthBackContext.Provider>
  )
}

export function useAuthBack() {
  return useContext(AuthBackContext)
}
