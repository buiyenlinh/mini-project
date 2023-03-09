import { DatePicker } from "@progress/kendo-react-dateinputs";
import {
  Field,
  FieldRenderProps,
  FieldWrapper,
} from "@progress/kendo-react-form";
import { Label } from "@progress/kendo-react-labels";
import InputError from "../input/input-error";
import FieldRadioGroup from "../radio";
import { Error } from "@progress/kendo-react-labels";

const Information = () => {
  const fullNameValidator = (value: string) => {
    return value ? "" : "This field is required.";
  };

  const birthdayValidator = (value: Date) => {
    const now = new Date();
    return value && now < value ? "Birthday must be before today" : "";
  };

  const FormDateInput = (fieldRenderProps: FieldRenderProps) => {
    const { validationMessage, touched, label, id, valid, ...others } =
      fieldRenderProps;
    return (
      <FieldWrapper>
        <Label editorValid={valid}>{label}</Label>
        <DatePicker valid={valid} format="dd/MM/yyyy" id={id} {...others} />
        {validationMessage && <Error>{validationMessage}</Error>}
      </FieldWrapper>
    );
  };

  return (
    <div>
      <div className="mb-3">
        <Field
          name="fullName"
          component={InputError}
          label="Full name"
          validator={fullNameValidator}
        />
      </div>
      <div className="mb-3">
        <Field
          name="gender"
          component={FieldRadioGroup}
          label="Gender"
          data={[
            {
              label: "Female",
              value: "female",
            },
            { label: "Male", value: "male" },
            { label: "Other", value: "other" },
          ]}
        />
      </div>

      <div className="mb-3">
        <Field
          key={"birthday"}
          id={"birthday"}
          name={"birthday"}
          label={"Birthday"}
          component={FormDateInput}
          validator={birthdayValidator}
        />
      </div>
    </div>
  );
};

export default Information;
