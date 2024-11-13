import { jwtDecode } from "jwt-decode"; 
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function ProtectUser({ children }) {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const MainToken = localStorage.getItem("Maintoken");

    if (MainToken) {
      try {
        const decodedToken = jwtDecode(MainToken);
        if (decodedToken.role === "user") {
          setRole(decodedToken.role);
        } else {
          navigate("/not-found");
        }
      } catch (error) {
        console.error("Token decoding failed:", error);
        navigate("/not-found");
      }
    } else {
      navigate("/not-found");
    }
  }, [navigate]);

  return role === "user" ? children : null;
}
