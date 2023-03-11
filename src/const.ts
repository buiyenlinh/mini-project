interface columnInterface {
  title?: string;
  field?: string;
  show?: boolean;
  filter?: "boolean" | "numeric" | "text" | "date" | undefined;
  minWidth?: number;
  minGridWidth?: number;
  locked?: boolean;
  width?: string | number;
  format?: string;
}

export const userColumns: columnInterface[] = [
  {
    field: "fullName",
    title: "Full name",
    width: "",
  },
  {
    field: "birthday",
    title: "Birthday",
    width: "",
    format: "{0:dd/MM/yyyy}",
    filter: "date",
  },
  {
    field: "gender",
    title: "Gender",
    width: "",
  },
  {
    field: "email",
    title: "Email",
    width: "",
  },
  {
    field: "phoneNumber",
    title: "Phone Number",
    width: "",
  },
  {
    field: "address",
    title: "Address",
    width: "",
  },
];

export const genders = [
  {
    label: "Female",
    value: "Female",
  },
  { label: "Male", value: "Male" },
  { label: "Other", value: "Other" },
];

export const USER_DATA_ITEM_KEY = "id";
export const USER_SELECTED_FIELD = "selected";
