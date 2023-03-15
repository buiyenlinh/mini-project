import { makeAutoObservable, runInAction } from "mobx";
import { ToastItemProps } from "../components/toast/toast-item";

export class ToastStore {
  toasts: ToastItemProps[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addToastState = (toast: ToastItemProps) => {
    runInAction(() => {
      this.toasts = this.toasts.concat(toast);
    });
  };

  deleteToastState = (toastId: Date) => {
    runInAction(() => {
      this.toasts = this.toasts.filter((item) => item.id !== toastId);
    });
  };
}
