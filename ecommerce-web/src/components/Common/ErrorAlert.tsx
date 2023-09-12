import React, { useEffect, useState } from "react";

export default function ErrorAlert(props: { errorMsg: string }) {
  const [showErrorAlert, setShowErrorAlert] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowErrorAlert(false);
    }, 4000);
  }, []);

  return (
    <React.Fragment>
      {showErrorAlert ? (
        <div
          className="w-full max-w-sm mx-auto bg-rose-100 border-t-4 border-rose-500 rounded-b text-rose-900 px-4 py-3 rounded-md mb-5"
          role="alert"
        >
          <div className="flex items-center">
            <div className="py-1">
              <i className="fa-solid fa-circle-exclamation mr-4"></i>
            </div>
            <div>
              <p className="font-bold">{props.errorMsg}</p>
            </div>
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
}
