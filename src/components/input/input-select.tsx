import { DropDownList } from "@progress/kendo-react-dropdowns";
import { FieldRenderProps, FieldWrapper } from "@progress/kendo-react-form";
import { Label, Error } from "@progress/kendo-react-labels";
import { useRef } from "react";

export const InputDropDownList = (fieldRenderProps: FieldRenderProps) => {
  const {
    wrapperStyle,
    label,
    labelId,
    valid,
    id,
    validationMessage,
    errorId,
    optional,
    visited,
    required,
    ...others
  } = fieldRenderProps;

  const editorRef = useRef<any>(null);

  return (
    <FieldWrapper style={wrapperStyle}>
      <Label
        id={labelId}
        editorRef={editorRef}
        editorId={id}
        optional={optional}
      >
        <span className="font-bold">
          {label}
          {required && (valid || validationMessage) && (
            <span className="text-red-500 inline-block pl-[1px]">*</span>
          )}
        </span>
      </Label>
      <DropDownList
        ref={editorRef}
        valid={valid}
        id={id}
        required={required}
        {...others}
      />

      {visited && validationMessage && (
        <Error id={errorId}>{validationMessage}</Error>
      )}
    </FieldWrapper>
  );
};
