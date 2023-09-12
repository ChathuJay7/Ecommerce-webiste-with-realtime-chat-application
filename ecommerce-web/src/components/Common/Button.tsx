import React from "react";

export default function Button(props: { name: string; handleAction: any }) {
  return (
    <React.Fragment>
      <button
        className="w-full h-14 bg-emerald-500 text-white text-sm font-bold py-2 px-4 rounded-md hover:bg-emerald-600 transition duration-300"
        type="submit"
        onClick={props.handleAction}
      >
        {props.name}
      </button>
    </React.Fragment>
  );
}
