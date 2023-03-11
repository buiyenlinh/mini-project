import { DatePicker } from "@progress/kendo-react-dateinputs";
import { FieldRenderProps, FieldWrapper } from "@progress/kendo-react-form";
import { Label, Error } from "@progress/kendo-react-labels";

export const InputDatePicker = (fieldRenderProps: FieldRenderProps) => {
  const { validationMessage, touched, label, id, valid, ...others } =
    fieldRenderProps;
  return (
    <FieldWrapper>
      <Label editorValid={valid}>
        <span className="font-bold">{label}</span>
      </Label>
      <DatePicker valid={valid} format="dd/MM/yyyy" id={id} {...others} />
      {validationMessage && <Error>{validationMessage}</Error>}
    </FieldWrapper>
  );
};
