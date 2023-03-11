import { Dialog } from "@progress/kendo-react-dialogs";
import { PropsWithChildren } from "react";

interface CreateOrUpdateProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
  onConfirm: () => void;
}

export const CreateOrUpdate = ({
  visible,
  setVisible,
  onConfirm,
  children,
}: PropsWithChildren<CreateOrUpdateProps>) => {
  const TitleBar = () => {
    return (
      <div
        className="custom-title flex items-center"
        style={{
          fontSize: "16px",
          lineHeight: "1.3em",
        }}
      >
        <span className="k-icon k-i-delete k-i-trash text-red-500 text-[20px]" />
        <span className="pl-2 text-red-500">Create/Update delete</span>
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
          {children}
          {/* <DialogActionsBar>
            <div className="pr-2 pl-1 py-1">
              <Button themeColor="error" onClick={onConfirm} className="w-full">
                Yes
              </Button>
            </div>
            <div className="pl-2 pr-1 py-1">
              <Button
                themeColor="base"
                onClick={handleClose}
                className="w-full"
              >
                No
              </Button>
            </div>
          </DialogActionsBar> */}
        </Dialog>
      )}
    </div>
  );
};
