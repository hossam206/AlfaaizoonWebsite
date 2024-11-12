import axios from "axios";
import { jwtDecode } from "jwt-decode";
const api = import.meta.env.VITE_REACT_APP_HOST;
const Port = import.meta.env.VITE_REACT_APP_PORT;

export const LoginFunc = async (loginData) => {
  try {
    const response = await axios.post(
      `${api}:${Port}/api/v1/login`,
      loginData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.status == 200) {
      const decodedToken = jwtDecode(response.data.token);
       localStorage.setItem("Maintoken", response.data.token); // Store token as a string, not JSON
      return decodedToken.role;
    } else {
      return new Error("Invalid credentials or server error");
    }
  } catch (error) {
    throw new error(error);
  }
};
