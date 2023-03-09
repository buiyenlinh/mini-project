import { NotificationGroup } from "@progress/kendo-react-notification";
import ToastItem, { ToastItemProps } from "./toast-item";

export interface ToastProps {
  toastList: ToastItemProps[];
}
const Toast = ({ toastList }: ToastProps) => {
  return (
    <NotificationGroup
      style={{
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      {toastList.map((toast, index) => (
        <ToastItem key={index} {...toast} />
      ))}
    </NotificationGroup>
  );
};

export default Toast;
