import { Fade } from "@progress/kendo-react-animation";
import { Notification } from "@progress/kendo-react-notification";
import { useEffect } from "react";
import useStore from "../../store";

export type ToastType =
  | "none"
  | "success"
  | "error"
  | "warning"
  | "info"
  | undefined;
export interface ToastItemProps {
  id: Date;
  content: string;
  type: ToastType;
}

export const ToastItem = ({ id, content, type }: ToastItemProps) => {
  const { toastStore } = useStore();
  const { deleteToastState } = toastStore;

  useEffect(() => {
    const timeOut = setTimeout(() => {
      deleteToastState(id);
    }, 5000);

    return () => {
      clearTimeout(timeOut);
    };
  }, [id, deleteToastState]);

  return (
    <Fade>
      <Notification
        type={{ style: type, icon: true }}
        closable={true}
        onClose={() => deleteToastState(id)}
        className="px-3.5 py-2.5"
      >
        <div>
          <span className="text-base font-medium">{content}</span>
        </div>
      </Notification>
    </Fade>
  );
};
