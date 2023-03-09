import { Button } from "@progress/kendo-react-buttons";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";

interface DeleteConfirmProps {
  visible: boolean;
  content?: string;
  setVisible: (value: boolean) => void;
  onConfirm: () => void;
}

const DeleteConfirm = ({
  visible,
  content,
  setVisible,
  onConfirm,
}: DeleteConfirmProps) => {
  const handleClose = () => {
    setVisible(false);
  };

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
        <span className="pl-2 text-red-500">User delete</span>
      </div>
    );
  };

  return (
    <div>
      {visible && (
        <Dialog title={<TitleBar />} onClose={handleClose}>
          <p style={{ margin: "25px", textAlign: "center" }}>{content}</p>
          <DialogActionsBar>
            <div className="pl-2 pr-1 py-1">
              <Button
                themeColor="base"
                onClick={handleClose}
                className="w-full"
              >
                No
              </Button>
            </div>
            <div className="pr-2 pl-1 py-1">
              <Button themeColor="error" onClick={onConfirm} className="w-full">
                Yes
              </Button>
            </div>
          </DialogActionsBar>
        </Dialog>
      )}
    </div>
  );
};

export default DeleteConfirm;
