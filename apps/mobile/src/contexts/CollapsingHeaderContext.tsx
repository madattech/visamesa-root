import React, {createContext, useContext} from 'react';

type CollapsingHeaderContextValue = {
  scrollToY: (y: number) => void;
};

const CollapsingHeaderContext = createContext<CollapsingHeaderContextValue | null>(
  null,
);

export function CollapsingHeaderProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: CollapsingHeaderContextValue;
}) {
  return (
    <CollapsingHeaderContext.Provider value={value}>
      {children}
    </CollapsingHeaderContext.Provider>
  );
}

/**
 * Hook to access scroll functionality from a CollapsingHeaderScreen.
 * Returns null if not within a collapsing header context.
 */
export function useCollapsingHeaderScroll(): CollapsingHeaderContextValue | null {
  return useContext(CollapsingHeaderContext);
}
