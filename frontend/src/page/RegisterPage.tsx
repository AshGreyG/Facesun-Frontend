import axios from "axios";
import React from "react";
import { useNavigation } from "react-router-dom";
import { backendURL } from "../utility/utility";

type RegisterStatus =
  | "Success"
  | "Fail"
  | "UnknownError"
  | "Pending";

function RegisterPage() {
  const registerAPI = axios.create({
    baseURL: backendURL,
    timeout: 5000,
    headers: {

    }
  })
}