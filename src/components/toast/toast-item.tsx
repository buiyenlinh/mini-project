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
      >
        <div className="py-1 px-6">
          <span className="text-base">{content}</span>
        </div>
      </Notification>
    </Fade>
  );
};

export default ToastItem;
