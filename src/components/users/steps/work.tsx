import { Field } from "@progress/kendo-react-form";

import { departments, levels } from "../../../const";
import { InputDropDownList } from "../../input/input-dropdown-list";
import { dropDownSelectValidator } from "../validate";

export const Work = () => {
  return (
    <div>
      <div className="mb-5">
        <Field
          id="department"
          name="department"
          label="Department"
          component={InputDropDownList}
          data={departments}
          dataItemKey="value"
          textField="label"
          filterable={true}
          validator={dropDownSelectValidator}
          required
          defaultItem={{
            value: null,
            label: "Select department...",
          }}
        />
      </div>

      <div className="mb-5">
        <Field
          id="level"
          name="level"
          label="Level"
          component={InputDropDownList}
          data={levels}
          dataItemKey="value"
          textField="label"
          filterable={true}
          defaultItem={{
            value: null,
            label: "Select level...",
          }}
        />
      </div>
    </div>
  );
};
