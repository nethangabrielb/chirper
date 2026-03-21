"use client";

import { useEffect } from "react";

const AuthSuccess = () => {
  useEffect(() => {
    window.opener?.postMessage({ success: true }, "*");
    window.close();
  }, []);

  return (
    <div className="w-full min-h-svh flex items-center justify-center text-darker">
      Completing sign in...
    </div>
  );
};

export default AuthSuccess;
