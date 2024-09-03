import { useState, useEffect } from "react";
import Title from "../components/TitlePage"
import FormAddUser from "../components/FormAddUser";

const AddUser = () => {
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const getTitle = () => {
    return role === "superadmin" ? "Tambah Operator" : "Tambah Karyawan";
  };

  return (
    <>
	<Title text={getTitle()} />
      <FormAddUser role={role === "superadmin" ? "operator" : "karyawan"} />
    </>
  );
};

export default AddUser;
