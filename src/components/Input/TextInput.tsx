import { FC } from "react";
import { Field } from "react-final-form";

type TextInputProps = {
  id: string;
  label: string;
  placeholder: string;
  defaultValueLabel?: string;
  defaultValue: string;
  validate?: (value: string) => string | undefined;
};

export const TextInput: FC<TextInputProps> = ({
  id,
  label,
  placeholder,
  defaultValueLabel,
  defaultValue,
  validate,
}) => {
  const required = (value: string) => (value ? undefined : "Required");

  const handleValidate = (value: string) => {
    let error: string | undefined;

    if ((error = required(value))) {
      return error;
    }
    if (validate && (error = validate(value))) {
      return error;
    }
    return undefined;
  };

  return (
    <Field name={id} validate={handleValidate}>
      {({ input, meta }) => (
        <div>
          <label className="label">
            <span className="label-text">{label}</span>
          </label>
          <div className="flex flex-row">
            <input id={id} type="text" {...input} placeholder={placeholder} className="input input-bordered w-full" />
            <label
              htmlFor={id}
              className="btn btn-outline ml-[12px]"
              onClick={() => {
                input.onChange(defaultValue);
              }}
            >
              {defaultValueLabel ?? defaultValue}
            </label>
          </div>
          <label className="label">
            <span className="label-text-alt text-error h-4 min-w-1">{meta.touched && meta.error ? meta.error : ` `}</span>
          </label>
        </div>
      )}
    </Field>
  );
};
