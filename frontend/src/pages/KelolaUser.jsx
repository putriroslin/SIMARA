import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { RiUserAddLine } from "react-icons/ri";
import UserList from "../components/UserList";
import Title from "../components/TitlePage";

const Button = styled.div`
  position: relative;
  line-height: 15px;
`;

const ButtonWhiteBigHover = styled.div`
  border-radius: 4px;
  background-color: #fff;
  border: 1px solid #0176c3;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 10px;
  gap: 10px;
  font-size: 15px;
  color: #0176c3;
  margin: 10px 0;
  cursor: pointer;
`;

const KelolaUser = () => {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const handleAddUser = () => {
    const type = role === "superadmin" ? "operator" : "karyawan"; //jika rolenya superadmin maka tipe yang dikelola adalah operator
    navigate(`/add-${type}`);
  };

  const getTitle = () => {
    return role === "superadmin" ? "Kelola Operator" : "Kelola Karyawan";
  };

  return (
    <>
      <Title text={getTitle()} />
      <ButtonWhiteBigHover onClick={handleAddUser}>
        <Button>
          {role === "superadmin" ? "Tambah Operator" : "Tambah Karyawan"}
        </Button>
        <RiUserAddLine />
      </ButtonWhiteBigHover>
      {/* hanya menampilkan pengguna dengan role operator ketika yang mengakses adalah superadmin */}
      <UserList role={role === "superadmin" ? "operator" : "karyawan"} />
    </>
  );
};

export default KelolaUser;
