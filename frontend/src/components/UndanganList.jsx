import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { format } from "date-fns"; //mengatur tampilan format tgl dan waktu
import id from "date-fns/locale/id"; // Locale Indonesia untuk format tanggal
import { FaArrowUpRightFromSquare, FaCalendarPlus } from "react-icons/fa6";

const Status = styled.div`
  font-size: 15px;
`;
const Jenis = styled.div`
  border-radius: 22px;
  background-color: ${(props) =>
    props.jenisRapat === "offline"
      ? "rgba(40, 167, 69, 0.5)"
      : "rgba(255, 193, 7, 0.5)"};
  padding: 8px 12px;
  font-size: 12px;
`;

const StatusParent = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const Tema = styled.div`
  font-weight: 600;
  font-size: 20px;
`;
const Waktu = styled.div`
  font-size: 15px;
`;
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
  cursor: pointer;
  text-align: justify;
  align-self: stretch; //memenuhi card
`;
const CardUndanganRapat = styled.div`
  align-self: stretch;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  border-radius: 8px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 16px;
  gap: 10px;
  margin: 10px 0;
`;

const UndanganList = () => {
  const [role, setRole] = useState("");
  const [jadwals, setJadwals] = useState([]);
  const navigate = useNavigate();

  const handleUpdateJadwal = (id) => {
    navigate(`/update-jadwal/${id}`);
    console.log("Edit jadwal:", id);
  };

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    console.log("Stored role:", storedRole); // Debugging role
    setRole(storedRole);

    const fetchJadwals = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("No access token found");
        }

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/jadwals`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
			withCredentials: true,
          }
        );

        console.log("Fetched jadwals:", response.data); // Debugging response data

        setJadwals(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchJadwals();
  }, []);

  return (
    <>
      {jadwals.map((jadwal) => (
        <CardUndanganRapat key={jadwal.id}>
          <StatusParent>
            <Status>{jadwal.status}</Status>
            <Jenis jenisRapat={jadwal.jenisRapat}>{jadwal.jenisRapat}</Jenis>
          </StatusParent>
          <Tema>{jadwal.tema}</Tema>
          {/* Karena new Date() memerlukan format yang lengkap untuk bisa bekerja (tanggal dan waktu), 
		  maka kita perlu menggabungkan jadwal.waktuMulai dan jadwal.tanggalRapat 
		  menjadi satu string yang bisa diparsing menjadi objek Date. */}
          <Waktu>
            {jadwal.waktuMulai && jadwal.tanggalRapat ? (
              <>
                {format(
                  new Date(`${jadwal.tanggalRapat}T${jadwal.waktuMulai}`),
                  "HH:mm",
                  { locale: id }
                )}{" "}
                WIB,{" "}
                {format(new Date(jadwal.tanggalRapat), "dd MMMM yyyy", {
                  locale: id,
                })}
              </>
            ) : (
              "Invalid Date"
            )}
          </Waktu>

          <ButtonWhiteBigHover>
            <Button>Detail Rapat</Button>
            <FaArrowUpRightFromSquare />
          </ButtonWhiteBigHover>
          {role === "operator" && (
            <ButtonWhiteBigHover onClick={() => handleUpdateJadwal(jadwal.id)}>
              <Button>Update Jadwal</Button>
              <FaCalendarPlus />
            </ButtonWhiteBigHover>
          )}
        </CardUndanganRapat>
      ))}
    </>
  );
};

export default UndanganList;
