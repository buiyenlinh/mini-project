import { Field } from "@progress/kendo-react-form";
import InputError from "../input/input-error";
import FieldRadioGroup from "../radio";
import { genders } from "../../const";
import { birthdayValidator, fullNameValidator } from "./validate";
import { InputDatePicker } from "../input/input-date-picker";

const Information = () => {
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
          data={genders}
        />
      </div>

      <div className="mb-3">
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

export default Information;
