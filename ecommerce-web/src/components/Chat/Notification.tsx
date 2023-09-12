import React, { useEffect, useState } from 'react';

export default function Notification(props: {
  emptyReadListCount: {
    index: number;
    count: number;
    username: string;
    threadName: string;
  }[];
}) {
  const [isShowNotificationDropDown, setIsShowNotificationDropDown] =
    useState(false);

  const handleNotificationDropDown = () => {
    setIsShowNotificationDropDown(!isShowNotificationDropDown);
  };

  const uniqueNotifications = Array.isArray(props.emptyReadListCount)
    ? Array.from(new Set(props.emptyReadListCount.map(item => item.threadName)))
        .map(threadName => {
          const count = props.emptyReadListCount
            .filter(item => item.threadName === threadName)
            .reduce((total, item) => total + item.count, 0);

          return {
            threadName,
            count,
          };
        })
    : [];

  return (
    <div className="flex" id="navbar-sticky">
      <button
        type="button"
        className="relative p-1 mr-3 text-gray-400 bg-gray-800 rounded-full hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
        onClick={handleNotificationDropDown}
      >
        <span className="sr-only">View notifications</span>
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
        {uniqueNotifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-3 -translate-y-2 bg-red-600 rounded-full">
            {props.emptyReadListCount.reduce(
              (total, { count }) => total + count,
              0
            )}
          </span>
        )}
      </button>
      {isShowNotificationDropDown && (
        <div className="absolute w-40 p-3 m-5 rounded-md shadow-2xl bg-slate-100 min-h-fit right-5 top-10">
          <ul className="flex flex-col items-center justify-center w-full">
            {uniqueNotifications.map(({ threadName, count }, index) => (
              count !== 0 && (
                <li className="my-1" key={index}>
                  {count} Message From {threadName}
                </li>
              )
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
