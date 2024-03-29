import { Button } from "@progress/kendo-react-buttons";
import clsx from "clsx";
import { MouseEventHandler } from "react";

export type ThemeColorButton =
  | null
  | "base"
  | "primary"
  | "secondary"
  | "tertiary"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "dark"
  | "light"
  | "inverse";

export type TypeButton = "submit" | "reset" | "button" | undefined;

export interface ButtonCustomProps {
  disabled?: boolean;
  className?: string;
  themeColor?: ThemeColorButton;
  title?: string;
  iconLeftClass?: string;
  iconRightClass?: string;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  type?: TypeButton;
}

export const ButtonCustom = ({
  disabled,
  themeColor = "base",
  type = "button",
  className,
  title,
  iconLeftClass,
  iconRightClass,
  onClick,
}: ButtonCustomProps) => {
  return (
    <Button
      className={className}
      themeColor={themeColor}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {iconLeftClass && <i className={clsx("mr-2", iconLeftClass)} />}

      {title && (
        <span className="pb-[2px] inline-block font-medium">{title}</span>
      )}

      {iconRightClass && <i className={clsx("ml-2", iconRightClass)} />}
    </Button>
  );
};
