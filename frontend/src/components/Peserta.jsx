import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import Title from "./TitlePage";
import axios from "axios";
import defaultAvatar from "../assets/pngwing.com.png";
import { RiUserAddLine, RiUserFollowLine } from "react-icons/ri";

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  position: relative;
  border-radius: 50px;
  object-fit: cover;
`;
const Name = styled.b`
  position: relative;
  align-self: stretch;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  font-size: 15px;
`;
const PesertaIcon = styled.span`
  border-radius: 50px;
  background-color: ${(props) => (props.selected ? "#ccc" : "#0176c3")};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 5px;
  position: relative;
  object-fit: cover;
  cursor: pointer;
  color: white;
`;
const ButtonPrimaryBigHover = styled.div`
  border-radius: 4px;
  background-color: #0176c3;
  border: 1px solid #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  font-size: 15px;
  color: #fff;
  gap: 10px;
  cursor: pointer;
`;
const ListPeserta = styled.div`
  width: 100%;
  border-radius: 4px;
  background-color: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  margin: 10px 0;
  box-sizing: border-box;
  gap: 15px;
`;
const Container = styled.div`
  width: 100%;
  overflow-x: auto;
  margin: 10px 0;
`;

const TambahPeserta = () => {
  const [users, setUsers] = useState([]); //data pengguna dari db
  const location = useLocation();
  const { selectedParticipants = [], mode, id } = location.state || [];
  // State mode dan id ditambahkan di useLocation untuk mengetahui apakah pengguna sedang menambah atau memperbarui jadwal.
  // Ini menentukan ke halaman mana pengguna akan diarahkan setelah memilih peserta.
  const [participants, setParticipants] = useState(selectedParticipants); // menyimpan id peserta yg dipilih
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("No access token found");
        }
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/users`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
			withCredentials: true,
          }
        );
        console.log("Daftar pengguna:", response.data);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const toggleParticipant = (user) => {
    console.log("Clicked user:", user);
    if (participants.find((u) => u.id === user.id)) {
      // Hapus jika sudah dipilih
      setParticipants(participants.filter((u) => u.id !== user.id));
    } else {
      // Tambahkan ke list peserta
      setParticipants([...participants, user]);
    }
  };

  const handleSave = () => {
    console.log("Selected participants:", participants); // Debugging untuk melihat id participants

    // Navigasi ke halaman form jadwal yang sesuai berdasarkan mode
    if (mode === "update") {
      navigate(`/update-jadwal/${id}`, {
        state: { selectedParticipants: participants },
      });
    } else {
      navigate("/add-jadwal", {
        state: { selectedParticipants: participants },
      });
    }
  };

  return (
    <>
      <Container>
        <Title text="Tambah Peserta" />
        {users.map((user) => {
          //   console.log(user.profilePhoto); // Tambahkan ini untuk debugging
          const userProfilePhoto = user.profilePhoto
            ? `${process.env.REACT_APP_API_URL}${user.profilePhoto}`
            : defaultAvatar;
          return (
            <ListPeserta key={user.id}>
              <Avatar src={userProfilePhoto} alt={user.name} />
              <Name>{user.name}</Name>
              <PesertaIcon
                selected={participants.find((u) => u.id === user.id)}
                onClick={() => toggleParticipant(user)}
              >
                {participants.find((u) => u.id === user.id) ? (
                  <RiUserFollowLine />
                ) : (
                  <RiUserAddLine />
                )}
              </PesertaIcon>
            </ListPeserta>
          );
        })}
        <ButtonPrimaryBigHover onClick={handleSave}>
          Simpan
        </ButtonPrimaryBigHover>
      </Container>
    </>
  );
};

export default TambahPeserta;
