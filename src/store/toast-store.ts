import { makeAutoObservable, reaction, runInAction } from "mobx";
import { ToastItemProps } from "../components/toast/toast-item";

export class ToastStore {
  toasts: ToastItemProps[] = [];

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.toasts,
      () => console.log(this.toasts)
    );
  }

  onAddToast = (toast: ToastItemProps) => {
    runInAction(() => {
      this.toasts = this.toasts.concat(toast);
    });
  };

  onDeleteToast = (toastId: Date) => {
    runInAction(() => {
      this.toasts = this.toasts.filter((item) => item.id !== toastId);
    });
  };
}
