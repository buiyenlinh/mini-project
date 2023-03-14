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
    title: "Phone number",
    width: "",
  },
  {
    field: "address",
    title: "Address",
    width: "",
  },
  {
    field: "department",
    title: "Department",
    width: "",
  },
  {
    field: "level",
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
    value: "Female",
  },
  { label: "Male", value: "Male" },
  { label: "Other", value: "Other" },
];

export const departments: string[] = [
  "Administration",
  "Marketing",
  "Purchasing",
  "Human Resources",
  "IT",
  "Sales",
];

export const levels: string[] = [
  "Level 1",
  "Level 2",
  "Level 3",
  "Level 4",
  "Level 5",
];
