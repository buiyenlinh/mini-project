import { isEmailValidator, isPhoneNumberValidator } from "../../helper";

export const requiredValidator = (value: string) => {
  return value ? "" : "This field is required.";
};

export const birthdayValidator = (value: Date) => {
  const now = new Date();
  return value && now < value ? "Birthday must be before today" : "";
};

export const emailValidator = (value: string) => {
  return isEmailValidator(value) ? "" : "Please enter a valid email.";
};

export const phoneNumberValidator = (value: string) => {
  return isPhoneNumberValidator(value)
    ? ""
    : "Please enter a valid phone number.";
};
