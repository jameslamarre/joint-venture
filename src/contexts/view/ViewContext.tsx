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
  page?: '' | 'films' | 'contact'
  nextPage?: '' | 'films' | 'contact'
  previousPage?: '' | 'films' | 'contact'

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
