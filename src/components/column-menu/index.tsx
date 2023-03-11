import {
  GridColumnMenuFilter,
  GridColumnMenuProps,
  GridColumnMenuSort,
} from "@progress/kendo-react-grid";

export const ColumnMenu = (props: GridColumnMenuProps) => {
  return (
    <div>
      <GridColumnMenuSort {...props} />
      <GridColumnMenuFilter {...props} />
    </div>
  );
};
