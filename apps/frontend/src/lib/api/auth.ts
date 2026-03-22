// General factory for auth server interface

const authApi = (() => {
  const googleAuth = () => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    window.open(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/login/google`,
      "googleAuthPopup",
      `width=${width},height=${height},left=${left},top=${top},resizable=no,scrollbars=no,status=no`,
    );
  };

  const checkPropertyUnique = async (
    value: string,
    type: string,
    credentials?: boolean,
  ) => {
    const res = await fetch(
      `/api/users/availability?property=${type}&value=${value}`,
      { credentials: credentials ? "include" : "omit" },
    );
    const data = await res.json();
    if (data.status === "success") {
      return true;
    } else {
      return false;
    }
  };

  const logout = async () => {
    const res = await fetch(`/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Error logging out.");
    }

    const data = await res.json();
    return data;
  };

  const loginAsGuest = async () => {
    const res = await fetch(`/api/auth/login?guest=true`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Error logging out.");
    }

    const data = await res.json();
    return data;
  };

  return { googleAuth, checkPropertyUnique, logout, loginAsGuest };
})();

export { authApi };
