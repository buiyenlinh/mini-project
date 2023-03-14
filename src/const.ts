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

export const USER_DATA_ITEM_KEY = "id";
export const USER_SELECTED_FIELD = "selected";

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
    field: "gender.label",
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
    title: "Phone number",
    width: "",
  },
  {
    field: "address",
    title: "Address",
    width: "",
  },
  {
    field: "department.label",
    title: "Department",
    width: "",
  },
  {
    field: "level.label",
    title: "Level",
    width: "",
  },
  {
    field: "created_at",
    title: "Created at",
    width: "",
    format: "{0:HH:mm dd/MM/yyyy}",
    filter: "date",
  },
  {
    field: "updated_at",
    title: "Updated at",
    width: "",
    format: "{0:HH:mm dd/MM/yyyy}",
    filter: "date",
  },
];

export const genders = [
  {
    label: "Female",
    value: {
      label: "Female",
      value: "female",
    },
  },
  {
    label: "Male",
    value: { label: "Male", value: "male" },
  },
  {
    label: "Other",
    value: { label: "Other", value: "other" },
  },
];

export const departments = [
  {
    label: "Administration",
    value: "administration",
  },
  {
    label: "Marketing",
    value: "marketing",
  },
  {
    label: "Purchasing",
    value: "purchasing",
  },
  {
    label: "Puman Resources",
    value: "human Resources",
  },
  {
    label: "IT",
    value: "IT",
  },
];

export const levels = [
  {
    label: "Level 1",
    value: "level 1",
  },
  {
    label: "Level 2",
    value: "level 2",
  },
  {
    label: "Level 3",
    value: "level 3",
  },
  {
    label: "Level 4",
    value: "level 4",
  },
];
