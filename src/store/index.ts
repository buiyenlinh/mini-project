import { createContext, useContext } from "react";
import { ToastStore } from "./toast-store";
import { UserStore } from "./user-store";

export const rootStore = {
  userStore: new UserStore(),
  toastStore: new ToastStore(),
};

type RootStore = typeof rootStore;

const rootStoreContext = createContext<null | RootStore>(null);

export const Provider = rootStoreContext.Provider;

const useStore = () => {
  const store = useContext(rootStoreContext);

  if (store === null) {
    throw new Error("Store cannot be null, please add a context provider");
  }

  return store;
};

export default useStore;
