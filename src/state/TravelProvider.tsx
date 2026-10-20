import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
import { breadcrumbs } from "../bugscreen/bugscreen";

const TravelContext = createContext<{
  savedIds: ReadonlySet<string>;
  toggleSaved: (id: string) => void;
} | null>(null);

export function TravelProvider({ children }: PropsWithChildren) {
  const [savedIds, setSavedIds] = useState(() => new Set(["amalfi", "banff"]));

  function toggleSaved(id: string) {
    const next = new Set(savedIds);
    const saved = !next.has(id);
    if (saved) next.add(id);
    else next.delete(id);
    setSavedIds(next);
    breadcrumbs.saveToggled(id, saved);
  }

  return (
    <TravelContext.Provider value={{ savedIds, toggleSaved }}>
      {children}
    </TravelContext.Provider>
  );
}

export function useTravel() {
  const travel = useContext(TravelContext);
  if (!travel) throw new Error("useTravel must be used inside TravelProvider");
  return travel;
}
