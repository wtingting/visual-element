import type { Component } from "vue";
export type ButtonType = "primary" | "success" | "warning" | "danger" | "info";
export type NativeType = "button" | "submit" | "reset";
export type ButtonSize = "large" | "default" | "small";

export interface ButtonProps {
  tag?: string|Component;
  type?: ButtonType;
  nativeType?: NativeType;
  size?: ButtonSize;
  plain?: boolean;
  round?: boolean;
  circle?: boolean;
  disabled?: boolean;
  loading?: boolean;  
  icon?: string;
}