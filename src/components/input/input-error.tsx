import { FieldRenderProps, FieldWrapper } from "@progress/kendo-react-form";
import { Input } from "@progress/kendo-react-inputs";
import { Error, Label } from "@progress/kendo-react-labels";

const InputError = (fieldRenderProps: FieldRenderProps) => {
  const {
    validationMessage,
    visited,
    id,
    valid,
    disabled,
    optional,
    touched,
    label,
    required,
    onFocus,
    ...others
  } = fieldRenderProps;

  return (
    <FieldWrapper>
      <Label editorId={id} editorDisabled={disabled} optional={optional}>
        <span className="font-bold">
          {label}
          {required && (valid || validationMessage) && (
            <span className="text-red-500 inline-block pl-[1px]">*</span>
          )}
        </span>
      </Label>
      <Input {...others} valid={valid} required />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
      {/* {touched && visited && validationMessage && (
        <Error>{validationMessage}</Error>
      )} */}
    </FieldWrapper>
  );
};

export default InputError;
