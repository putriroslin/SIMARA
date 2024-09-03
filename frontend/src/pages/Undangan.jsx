import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Title from "../components/TitlePage";
import { FaCalendarPlus } from "react-icons/fa6";
import UndanganList from "../components/UndanganList";

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

const Undangan = () => {
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const handleAddJadwal = () => {
    navigate(`/add-jadwal`);
  };
  return (
    <>
      <Title text="Undangan Rapat" />
      {role === "operator" && (
        <ButtonWhiteBigHover onClick={handleAddJadwal}>
          <Button>Buat Jadwal</Button>
          <FaCalendarPlus />
        </ButtonWhiteBigHover>
      )}
      <UndanganList />
    </>
  );
};

export default Undangan;
