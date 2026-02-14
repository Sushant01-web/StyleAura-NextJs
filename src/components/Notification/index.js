"use client";

import { Toaster } from "react-hot-toast";

export default function Notification() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
      }}
    />
  );
}
