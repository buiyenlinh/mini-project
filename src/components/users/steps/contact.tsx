import { Field } from "@progress/kendo-react-form";
import { useMemo } from "react";
import { useParams } from "react-router";
import useStore from "../../../store";
import { InputError } from "../../input/input-error";
import { DetaiUserParams } from "../create-or-update";
import {
  emailValidator,
  phoneNumberValidator,
  requiredValidator,
} from "../validate";

export const Contact = ({ userId }: { userId?: string }) => {
  const { slug } = useParams<DetaiUserParams>();
  const { userStore } = useStore();
  const { checkExistEmailOrPhone } = userStore;

  const getId = useMemo(() => {
    let id = slug !== "new" ? slug : undefined;
    if (userId) {
      id = userId;
    }
    return id;
  }, [slug, userId]);

  const onPhoneValidator = (value: string) => {
    value = value && value.trim();
    const validString = phoneNumberValidator(value);

    const errorExist = checkExistEmailOrPhone(undefined, value, getId);
    return validString || errorExist[0];
  };

  const onEmailValidator = (value: string) => {
    value = value && value.trim();
    const validString = emailValidator(value);
    const errorExist = checkExistEmailOrPhone(value, undefined, getId);
    return validString || errorExist[0];
  };

  return (
    <div>
      <div className="mb-5">
        <Field
          name="email"
          component={InputError}
          label="Email"
          validator={onEmailValidator}
          required
        />
      </div>

      <div className="mb-5">
        <Field
          name="phoneNumber"
          component={InputError}
          label="Phone number"
          validator={onPhoneValidator}
          required
        />
      </div>

      <div className="mb-5">
        <Field
          name={"address"}
          component={InputError}
          label="Address"
          validator={requiredValidator}
          required
        />
      </div>
    </div>
  );
};
