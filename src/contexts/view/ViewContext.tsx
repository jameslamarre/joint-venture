import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react'

export type ViewProps = {
  page?: '' | 'about' | 'films' | 'join' | 'film'
  nextPage?: '' | 'about' | 'films' | 'join' | 'film'
  previousPage?: '' | 'about' | 'films' | 'join' | 'film'
  isNavigating?: boolean
  lastNavigationTime?: number

  film?: number | null
  previousFilm?: number
  nextFilm?: number
} | null

const ViewContext = createContext<
  [
    {
      view: ViewProps
    },
    {
      updateView: Dispatch<SetStateAction<any>>
    }
  ]
>([{}, {}] as any)

function useViewContext() {
  return useContext(ViewContext)
}

export function ViewProvider({ children }: { children: ReactNode }) {
  const [view, updateView] = useState<ViewProps>(null)

  return (
    <ViewContext.Provider
      value={useMemo(
        () => [
          { view },
          {
            updateView,
          },
        ],
        [view]
      )}
    >
      {children}
    </ViewContext.Provider>
  )
}

export function useView() {
  const [{ view }, { updateView }] = useViewContext()

  return [view, updateView]
}

export function useNavigation() {
  const [{ view }, { updateView }] = useViewContext()

  const setNavigating = (isNavigating: boolean) => {
    updateView((prev: ViewProps) => ({
      ...prev,
      isNavigating,
      lastNavigationTime: isNavigating ? Date.now() : prev?.lastNavigationTime,
    }))
  }

  const canNavigate = () => {
    if (!view?.lastNavigationTime) return true
    return Date.now() - view.lastNavigationTime > 800 // 0.8 second cooldown
  }

  return [view, updateView, { setNavigating, canNavigate }]
}
