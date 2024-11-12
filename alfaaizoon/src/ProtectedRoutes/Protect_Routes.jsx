import { jwtDecode } from "jwt-decode"; // Corrected import
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Protect_Routes({ children }) {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const MainToken = localStorage.getItem("Maintoken");

    if (MainToken) {
      try {
        const decodedToken = jwtDecode(MainToken);

        if (decodedToken.role === "admin") {
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

  return role === "admin" ? children : null;
}
