import { Field } from "@progress/kendo-react-form";
import InputError from "../../input/input-error";
import {
  emailValidator,
  phoneNumberValidator,
  requiredValidator,
} from "../validate";

export const Contact = () => {
  return (
    <div>
      <div className="mb-5">
        <Field
          name="email"
          component={InputError}
          label="Email"
          validator={emailValidator}
        />
      </div>

      <div className="mb-5">
        <Field
          name="phoneNumber"
          component={InputError}
          label="Phone number"
          validator={phoneNumberValidator}
        />
      </div>

      <div className="mb-5">
        <Field
          name={"address"}
          component={InputError}
          label="Address"
          validator={requiredValidator}
        />
      </div>
    </div>
  );
};
