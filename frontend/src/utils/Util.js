import Cookies from "js-cookie";

const Util = (function () {
  return {
    isEmpty(v, allowBlank) {
      return v === null || v === undefined || (!allowBlank ? v === "" : false);
    },
    on(eventName, listener) {
      document.addEventListener(eventName, listener);
    },
    off(eventName, listener) {
      document.removeEventListener(eventName, listener);
    },
    decodeJwt(token) {
      if (!token) return null;
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        return JSON.parse(jsonPayload);
      } catch (error) {
        console.error("Invalid token:", error);
        return null;
      }
    },
    setCookies(token, expiresInMs) {
      try {
        // Calculate expiration time in days (js-cookie uses days for expiration)
        const expiresInDays = expiresInMs / (1000 * 60 * 60 * 24);
        // Set the cookie with calculated expiration
        Cookies.set("accessToken", token, {
          expires: expiresInDays,
          path: "/",
        });
      } catch (error) {
        console.error("Error to set cookies from the token:", error);
      }
    },
    getCookies() {
      return Cookies.get('accessToken');
    },
    removeCookies() {
      Cookies.remove('accessToken', { path: '/' });
    },
  };
})();

export default Util;
