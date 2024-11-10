/** @format */

import React from "react";
import { ErrorMessage } from "@hookform/error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldErrors, UseFormRegister, FieldValues } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

type FormGeneratorProps = {
  type?: "text" | "email" | "password" | "number" | "password";
  inputType: "select" | "input" | "textarea";
  label?: string;
  options?: {
    label: string;
    value: string;
    id: string;
  }[];
  name: string;
  errors: FieldErrors<FieldValues>;
  placeholder?: string;
  register: UseFormRegister<FieldValues>;
  lines: number;
};

const FormGenerator = ({
  type,
  inputType,
  label,
  options,
  name,
  errors,
  placeholder,
  register,
  lines,
}: FormGeneratorProps) => {
  switch (inputType) {
    case "input":
      return (
        <Label
          className="flex flex-col gap-2 text-[#e7d9d9] "
          htmlFor={`input-${label}`}>
          {label && label}{" "}
          <Input
            id={`input-${label}`}
            {...register(name)}
            type={type}
            placeholder={placeholder}
            className="bg-transparent border-themeGray text-themeTextGray placeholder:text-xs auto-complete-off"
          />
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-400 mt-2 text-xs">
                {message === "Required" ? "" : message}
              </p>
            )}
          />
        </Label>
      );

    case "select":
      return (
        <Label htmlFor={`select-${label}`} className="flex flex-col gap-2">
          {label && label}
          <select
            id={`select-${label}`}
            className="w-full bg-transparent border-[1px] p-3 rounded-lg"
            {...register(name)}>
            {options?.length &&
              options.map((option) => (
                <option
                  value={option.value}
                  key={option.id}
                  className="dark:bg-muted">
                  {option.label}
                </option>
              ))}
          </select>
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-400 mt-2">
                {message === "Required" ? "" : message}
              </p>
            )}
          />
        </Label>
      );

    case "textarea":
      return (
        <Label className="flex flex-col gap-2" htmlFor={`input-${label}`}>
          {label && label}
          <Textarea
            className="bg-transparent border-themeGray text-themeTextGray"
            id={`input-${label}`}
            placeholder={placeholder}
            rows={lines}
            {...register(name)}
          />
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-400 mt-2">
                {message === "Required" ? "" : message}
              </p>
            )}
          />
        </Label>
      );
    default:
      break;
  }
};

export default FormGenerator;
