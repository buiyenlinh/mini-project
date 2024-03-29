import { isEmailValidator, isPhoneNumberValidator } from "../../helper";

export const requiredValidator = (value: string) => {
  value = value && value.trim();
  return value ? "" : "This field is required.";
};

export const birthdayValidator = (value: Date) => {
  const now = new Date();
  return value && now < value ? "Birthday must be before today" : "";
};

export const emailValidator = (value: string) => {
  value = value && value.trim();
  return isEmailValidator(value) ? "" : "Please enter a valid email.";
};

export const phoneNumberValidator = (value: string) => {
  value = value && value.trim();
  return isPhoneNumberValidator(value)
    ? ""
    : "Please enter a valid phone number.";
};

export const dropDownSelectValidator = (obj: {
  value: string;
  label: string;
}) => {
  return obj?.value ? "" : "This field is required";
};
