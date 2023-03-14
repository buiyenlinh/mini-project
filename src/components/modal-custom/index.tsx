import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import clsx from "clsx";
import { PropsWithChildren } from "react";
import { ButtonCustom, ButtonCustomProps } from "../button-custom";

interface ModalCustomProps {
  visible: boolean;
  modalTitle: string;
  iconClass: string;
  setVisible: (value: boolean) => void;
  onCancel?: () => void;
  confirmBtn?: ButtonCustomProps;
  cancelBtn?: ButtonCustomProps;
  headerModalClass?: string;
}

export const ModalCustom = ({
  visible,
  setVisible,
  modalTitle,
  iconClass,
  children,
  confirmBtn,
  cancelBtn,
  headerModalClass,
}: PropsWithChildren<ModalCustomProps>) => {
  const TitleBar = () => {
    return (
      <div
        className={clsx(
          "custom-title flex items-center font-bold px-2 text-base",
          headerModalClass
        )}
      >
        <span className={clsx("text-lg", iconClass)} />
        <span className="pl-2 text-lg">{modalTitle}</span>
      </div>
    );
  };

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <div>
      {visible && (
        <Dialog title={<TitleBar />} onClose={handleClose}>
          <div className="px-2 pb-2">{children}</div>
          {(confirmBtn || cancelBtn) && (
            <DialogActionsBar>
              <div className="p-4 flex justify-between space-x-4">
                {confirmBtn && <ButtonCustom {...confirmBtn} />}
                {cancelBtn && <ButtonCustom {...cancelBtn} />}
              </div>
            </DialogActionsBar>
          )}
        </Dialog>
      )}
    </div>
  );
};
