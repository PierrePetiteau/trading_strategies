import { FC } from "react";
import { Field, useField } from "react-final-form";

type ButtonGroupInputProps = {
  id: string;
  label: string;
  buttons: string[];
  defaultValue?: string;
};

export const ButtonGroupInput: FC<ButtonGroupInputProps> = ({ id, label, buttons, defaultValue }) => {
  const { meta } = useField(id);

  const required = (value: string) => (value ? undefined : "Required");

  return (
    <div>
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <div className="btn-group self-end flex w-full">
        {buttons.map((title) => {
          return (
            <Field
              key={title}
              name={id}
              type="radio"
              value={title}
              validate={required}
              defaultValue={defaultValue}
            >
              {({ input }) => (
                <input type="radio" data-title={title} className="btn btn-outline flex flex-grow" {...input} />
              )}
            </Field>
          );
        })}
      </div>
      <label className="label">
        <span className="label-text-alt text-error h-4 w-1">{meta.touched && meta.error ? meta.error : ` `}</span>
      </label>
    </div>
  );
};
