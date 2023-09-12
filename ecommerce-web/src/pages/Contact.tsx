import React, { useState } from "react";
import TopNav from "../components/Common/TopNav";
import Footer from "../components/Common/Footer";
import InputField from "../components/Common/InputField";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");

  const handleContactForm = () => {
    alert("Handle Contact Form");
  };

  return (
    <React.Fragment>
      <TopNav notificationCount={0} />
      <div className="p-5 mt-32 h-screen">
        <div className="w-full flex flex-row bg-emerald-500 rounded-xl px-5 py-12 items-center">
          <div className="w-1/2 h-full lg:pl-10 text-slate-100">
            <h1 className=" font-bold text-5xl">Contact Us</h1>
            <p className="mt-10">
              <span className="font-bold">Email Us:</span>{" "}
              hello@softcodeit.com
            </p>
            <p className="mt-5">
              <span className="font-bold">Call Us:</span> +94 711535535
            </p>
            <p className="mt-5">
              <span className="font-bold">Locate Us:</span> Colombo-07, Sri
              Lanka
            </p>
          </div>
          <div className="w-1/2 max-w-sm mx-auto bg-white p-8 rounded-md shadow-md">
            <InputField
              label="Name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={setName}
            />
            <InputField
              label="Email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={setEmail}
            />
            <InputField
              label="Phone Number"
              type="number"
              placeholder="0732993943"
              value={phoneNumber}
              onChange={setPhoneNumber}
            />
            <InputField
              label="Message"
              type="text"
              placeholder="John Doe"
              value={message}
              onChange={setMessage}
            />
            <button
              onClick={handleContactForm}
              className="w-full h-14 bg-emerald-500 text-white text-sm font-bold py-2 px-4 rounded-md hover:bg-emerald-600 transition duration-300"
              type="submit"
            >
              Submit Message
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
