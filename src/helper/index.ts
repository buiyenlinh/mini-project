export const isEmailValidator = (value: string) => {
  const emailRegex: RegExp = new RegExp(/\S+@\S+\.\S+/);
  return emailRegex.test(value);
};

export const isPhoneNumberValidator = (value: string) => {
  const phoneRegex: RegExp = new RegExp("^84|0[35789][0-9]{8,9}$");
  return phoneRegex.test(value);
};

export const checkDisabledSubmitButton = (errorItem: {
  [name: string]: any;
}) => {
  let isDisabled = false;
  for (let key in errorItem) {
    if (errorItem[key] !== "") {
      isDisabled = true;
      break;
    }
  }
  return isDisabled;
};
