import { createContext, useState } from "react";

export const CounterContext = createContext();

export function CounterContextProvider({ children }) {
  const [counter, setCounter] = useState(0);
  const [userName, setUserName] = useState("Ali");
  return (
    <CounterContext.Provider
      value={{ counter, setCounter, userName, setUserName }}
    >
      {/* app */}
      {children}
    </CounterContext.Provider>
  );
}
