import React from "react";
import { Link } from "react-router-dom";
import { VIEWS } from "../../utils/Views";

export default function CheckoutStatus(props: {
  statusTitle: string;
  statusIcon: string;
  isError: boolean;
  actionName: string;
  actionLink: string;
}) {
  return (
    <React.Fragment>
      <div className="w-full min-h-screen flex justify-center items-center">
        <div className="w-1/2 h-3/5 bg-slate-300 rounded-xl flex flex-col justify-center items-center py-16 px-10">
          <i
            className={`text-5xl mb-10 ${
              props.isError ? "text-rose-500" : "text-emerald-500"
            } ${props.statusIcon}`}
          ></i>
          <h1 className="uppercase text-center text-3xl font-bold text-slate-800">
            {props.statusTitle}
          </h1>
          <Link
            className="flex flex-row justify-center items-center mt-16 w-fit h-fit bg-emerald-500 text-white text-md font-bold p-5 rounded-lg hover:bg-emerald-600 transition duration-500"
            to={props.actionLink}
          >
            {props.actionName}
            <i className="ml-4 fa-solid fa-arrow-right text-lg font-bold"></i>
          </Link>
        </div>
      </div>
    </React.Fragment>
  );
}
