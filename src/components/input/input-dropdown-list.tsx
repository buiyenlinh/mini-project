import {
  CompositeFilterDescriptor,
  filterBy,
  FilterDescriptor,
} from "@progress/kendo-data-query";
import {
  DropDownList,
  DropDownListFilterChangeEvent,
} from "@progress/kendo-react-dropdowns";
import { FieldRenderProps, FieldWrapper } from "@progress/kendo-react-form";
import { Label, Error } from "@progress/kendo-react-labels";
import { useRef, useState } from "react";

export const InputDropDownList = (fieldRenderProps: FieldRenderProps) => {
  const {
    wrapperStyle,
    label,
    labelId,
    valid,
    id,
    validationMessage,
    errorId,
    optional,
    visited,
    data,
    required,
    ...others
  } = fieldRenderProps;

  const editorRef = useRef<any>(null);
  const timeout = useRef<any>(false);
  const [dataState, setDataState] = useState({
    data: data.slice(),
    loading: false,
  });

  const filterData = (filter: FilterDescriptor | CompositeFilterDescriptor) => {
    const newData = data.slice();
    return filterBy(newData, filter);
  };

  const filterChange = (event: DropDownListFilterChangeEvent) => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setDataState({ loading: false, data: filterData(event.filter) });
    }, 500);

    setDataState((prevState) => ({ ...prevState, loading: true }));
  };

  return (
    <FieldWrapper style={wrapperStyle}>
      <Label
        id={labelId}
        editorRef={editorRef}
        editorId={id}
        optional={optional}
      >
        <span className="font-bold">
          {label}
          {required && (valid || validationMessage) && (
            <span className="text-red-500 inline-block pl-[1px]">*</span>
          )}
        </span>
      </Label>
      <DropDownList
        id={id}
        valid={valid}
        ref={editorRef}
        required={required}
        data={dataState.data}
        loading={dataState.loading}
        onFilterChange={filterChange}
        {...others}
      />

      {visited && validationMessage && (
        <Error id={errorId}>{validationMessage}</Error>
      )}
    </FieldWrapper>
  );
};
