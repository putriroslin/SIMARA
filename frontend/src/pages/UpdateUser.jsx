import React, { useState, useEffect } from "react";
import Title from "../components/TitlePage";
import FormUpdateUser from "../components/FormUpdateUser";

const UpdateUser = () => {
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    console.log("Stored role in UpdateUser:", storedRole); // role pengguna yang login
    setRole(storedRole);
  }, []);

  const getTitle = () => {
    return role === "superadmin" ? "Edit Operator" : "Edit Karyawan";
  };
  return (
    <>
      <Title text={getTitle()} />
      {role ? <FormUpdateUser role={role} /> : <p>Loading...</p>}
    </>
  );
};

export default UpdateUser;
