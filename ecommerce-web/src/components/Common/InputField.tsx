import React from "react";

export default function InputField(props: {
  label: string;
  type: string;
  placeholder: string;
  value: string | number;
  onChange: any;
  disabled?:boolean;
}) {
  return (
    <React.Fragment>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="inputField"
        >
          {props.label}
        </label>
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          type={props.type}
          name="inputField"
          placeholder={props.placeholder}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          disabled={props.disabled}
        />
      </div>
    </React.Fragment>
  );
}
