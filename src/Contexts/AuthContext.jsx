import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);

  async function getUserData() {
    const { data } = await axios.get(
      "https://route-posts.routemisr.com/users/profile-data",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    setUserData(data?.data.user);
    console.log(data?.data.user);
  }

  useEffect(() => {
    // did mount

    if (localStorage.getItem("token")) {
      setUserToken(localStorage.getItem("token"));
      getUserData();
    }
  }, []);
  return (
    <AuthContext.Provider value={{ userToken, setUserToken, userData }}>
      {/* app */}
      {children}
    </AuthContext.Provider>
  );
}
