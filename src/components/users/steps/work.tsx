import { Field } from "@progress/kendo-react-form";

import { departments, levels } from "../../../const";
import { InputDropDownList } from "../../input/input-dropdown-list";
import { requiredValidator } from "../validate";

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
          validator={requiredValidator}
          required
        />
      </div>

      <div className="mb-5">
        <Field
          id="level"
          name="level"
          label="Level"
          component={InputDropDownList}
          data={levels}
        />
      </div>
    </div>
  );
};
