import { DropDownList } from "@progress/kendo-react-dropdowns";
import {
  Field,
  FieldRenderProps,
  FieldWrapper,
} from "@progress/kendo-react-form";
import { Error, Label } from "@progress/kendo-react-labels";
import { useRef } from "react";
import { departments } from "../../../const";
import InputError from "../../input/input-error";

export const Work = () => {
  const InputDropDownList = (fieldRenderProps: FieldRenderProps) => {
    const {
      wrapperStyle,
      label,
      editorId,
      editorDisabled,
      labelId,
      valid,
      id,
      disabled,
      validationMessage,
      errorId,
      hintId,
      ...others
    } = fieldRenderProps;

    const editorRef = useRef<any>(null);
    return (
      <FieldWrapper style={wrapperStyle}>
        <Label
          id={labelId}
          editorRef={editorRef}
          editorId={id}
          editorValid={valid}
          editorDisabled={disabled}
        >
          {label}
        </Label>
        <DropDownList
          ariaLabelledBy={labelId}
          ariaDescribedBy={`${hintId} ${errorId}`}
          ref={editorRef}
          valid={valid}
          id={id}
          disabled={disabled}
          {...others}
        />

        {validationMessage && <Error id={errorId}>{validationMessage}</Error>}
      </FieldWrapper>
    );
  };

  const requiredValidator = (value: string) => {
    console.log("value", value);
    return value ? "" : "Error: This field is required.";
  };

  return (
    <div>
      <div className="mb-5">
        <Field
          name="fullName"
          label="Full name"
          component={InputDropDownList}
          validator={requiredValidator}
        />
      </div>
    </div>
  );
};
