import { Fade } from "@progress/kendo-react-animation";
import { Notification } from "@progress/kendo-react-notification";
import { useEffect } from "react";
import useStore from "../../store";

export interface ToastItemProps {
  id: Date;
  content: string;
  type: "none" | "success" | "error" | "warning" | "info" | undefined;
}

const ToastItem = ({ id, content, type }: ToastItemProps) => {
  const { toastStore } = useStore();
  const { onDeleteToast } = toastStore;

  useEffect(() => {
    const timeOut = setTimeout(() => {
      onDeleteToast(id);
    }, 5000);

    return () => {
      clearTimeout(timeOut);
    };
  }, [id, onDeleteToast]);

  return (
    <Fade>
      <Notification
        type={{ style: type, icon: true }}
        closable={true}
        onClose={() => onDeleteToast(id)}
        className="px-3.5 py-2.5"
      >
        <div>
          <span className="text-base font-medium">{content}</span>
        </div>
      </Notification>
    </Fade>
  );
};

export default ToastItem;
