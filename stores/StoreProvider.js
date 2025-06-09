"use client"

import { createContext, useContext } from "react"
import { mobxStore } from "./mobxStore"

const StoreContext = createContext(mobxStore)

export function StoreProvider({ children }) {
  return <StoreContext.Provider value={mobxStore}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
