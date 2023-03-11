export const fullNameValidator = (value: string) => {
  return value ? "" : "This field is required.";
};

export const birthdayValidator = (value: Date) => {
  const now = new Date();
  return value && now < value ? "Birthday must be before today" : "";
};
