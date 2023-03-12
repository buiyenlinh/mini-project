import { Field } from "@progress/kendo-react-form";
import InputError from "../../input/input-error";
import FieldRadioGroup from "../../radio";
import { genders } from "../../../const";
import { birthdayValidator, requiredValidator } from "../validate";
import { InputDatePicker } from "../../input/input-date-picker";

export const Information = () => {
  return (
    <div>
      <div className="mb-5">
        <Field
          name="fullName"
          component={InputError}
          label="Full name"
          validator={requiredValidator}
        />
      </div>
      <div className="mb-5">
        <Field
          name="gender"
          component={FieldRadioGroup}
          label="Gender"
          data={genders}
        />
      </div>

      <div className="mb-5">
        <Field
          key={"birthday"}
          id={"birthday"}
          name={"birthday"}
          label={"Birthday"}
          component={InputDatePicker}
          validator={birthdayValidator}
        />
      </div>
    </div>
  );
};
