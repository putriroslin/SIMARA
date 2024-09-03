import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import {
  RiCalendarLine,
  RiDeleteBinLine,
  RiUserAddLine,
  RiCloseFill,
} from "react-icons/ri";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import stylesheet Quill
import styled from "styled-components";
import axios from "axios";
import Title from "./TitlePage";
import defaultAvatar from "../assets/pngwing.com.png";

const FormContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  margin: 10px 0;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
const FlexContainer = styled.div`
  display: flex;
  flex-direction: row; //elemen selalu tampil sebaris
  gap: 20px;
  width: 100%;

  //setiap elemen div mengambil ruang yg sama dlm flex container
  & > div {
    flex: 1;
  }
`;
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 15px;
`;
const Label = styled.label`
  line-height: 25px;
`;
const Input = styled.input`
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #9c9c9c;
  color: #5c5c5c;
  font-size: 15px;
  background-color: #fff;
`;
const Select = styled.select`
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #9c9c9c;
  color: #5c5c5c;
  font-size: 15px;
`;
const ButtonWhiteBigHover = styled.div`
  width: 150px;
  border-radius: 4px;
  background-color: #fff;
  border: 1px solid #0176c3;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin-bottom: 5px;
  font-size: 15px;
  color: #0176c3;
  gap: 10px;
  cursor: pointer;
`;
const ButtonPrimaryBigHover = styled.button`
  border-radius: 4px;
  background-color: #0176c3;
  border: 1px solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  font-size: 15px;
  color: #fff;
  gap: 10px;
  cursor: pointer;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #000;
`;
const TableHeader = styled.thead``;
const TableRow = styled.tr``;
const TableHeaderCell = styled.th`
  padding: 12px;
  border: 1px solid #000;
  text-align: left;
  font-size: 15px;
  background-color: #ebebe4;
`;
const TableCell = styled.td`
  padding: 12px;
  border: 1px solid #000;
  text-align: left;
  font-size: 15px;
  background-color: white;
`;
const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  margin: 10px 0;
`;
const DeleteIcon = styled.div`
  color: #dc3545;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Avatar = styled.img`
  width: 25px;
  position: relative;
  border-radius: 50px;
  height: 25px;
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
const PesertaIcon = styled.div`
  border-radius: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 5px;
  position: relative;
  object-fit: cover;
  cursor: pointer;
  color: #9c9c9c;
`;
const ListPeserta = styled.div`
  width: 100%;
  border-radius: 4px;
  background-color: #fff;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 10px;
  box-sizing: border-box;
  gap: 15px;
`;
const ErrorMessage = styled.span`
  color: red;
  margin: 0;
  font-size: 15px;
`;

const AddJadwal = () => {
  //penggunaan useState [array] {objek} "string"
  const { register, handleSubmit, setValue, getValues, watch } = useForm();
  const [jenisRapat, setJenisRapat] = useState([]);
  const [participants, setParticipants] = useState([]); // menyimpan id peserta yg dipilih
  const [keterangan, setKeterangan] = useState("");
  const [files, setFiles] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const selectedJenisRapat = watch("jenisRapat"); // Mengawasi perubahan pada input jenis rapat
  const waktuMulai = watch("waktuMulai");
  const waktuSelesai = watch("waktuSelesai");

  const handleAddParticipants = () => {
    // Simpan state form ke localStorage sebelum navigasi
    const formState = {
      tema: getValues("tema"),
      tanggalRapat: getValues("tanggalRapat"),
      waktuMulai: getValues("waktuMulai"),
      waktuSelesai: getValues("waktuSelesai"),
      jenisRapat: selectedJenisRapat,
      lokasi: getValues("lokasi"),
      link: getValues("link"),
      keterangan,
      files,
    };
    localStorage.setItem("jadwalForm", JSON.stringify(formState));
    navigate("/tambah-peserta", {
      state: { selectedParticipants: participants, mode: "add" },
    });
  };
  const removeParticipant = (id) => {
    setParticipants(
      participants.filter((participant) => participant.id !== id)
    );
  };
  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };
  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const savedFormData = JSON.parse(localStorage.getItem("jadwalForm"));
    if (savedFormData) {
      setValue("tema", savedFormData.tema);
      setValue("tanggalRapat", savedFormData.tanggalRapat);
      setValue("waktuMulai", savedFormData.waktuMulai);
      setValue("waktuSelesai", savedFormData.waktuSelesai);
      setValue("jenisRapat", savedFormData.jenisRapat);
      setValue("lokasi", savedFormData.lokasi);
      setValue("link", savedFormData.link);
      setKeterangan(savedFormData.keterangan);
      setFiles(savedFormData.files || []);
    }

    if (location.state && location.state.selectedParticipants) {
      setParticipants(location.state.selectedParticipants);
    }

    const fetchJenisRapat = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("No access token found");
        }
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/jadwals/jenis-rapat`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
			withCredentials: true,
          }
        );
        setJenisRapat(response.data);
      } catch (error) {
        console.error("Error fetching jenis rapat:", error);
      }
    };

    fetchJenisRapat();
  }, [location.state, setValue]);

  const validateTimes = () => {
    if (!waktuMulai || !waktuSelesai) return;

    const start = new Date(`1970-01-01T${waktuMulai}:00`);
    const end = new Date(`1970-01-01T${waktuSelesai}:00`);

    if (end <= start) {
      return "Waktu selesai tidak boleh lebih awal atau sama dengan waktu mulai.";
    }
    return null;
  };

  const onSubmit = async (data) => {
    console.log("Data submitted:", data);

    const timeError = validateTimes();
    if (timeError) {
      alert(timeError);
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const formData = new FormData();
      formData.append("tema", data.tema);
      formData.append("tanggalRapat", data.tanggalRapat);
      formData.append("waktuMulai", data.waktuMulai);
      formData.append("waktuSelesai", data.waktuSelesai);
      formData.append("jenisRapat", data.jenisRapat);
      formData.append("lokasi", data.lokasi);
      formData.append("link", data.link);
      formData.append("keterangan", keterangan);

      // Tambahkan participants sebagai array ke FormData (sebagai array)
      participants.forEach((participant) => {
        formData.append("participants[]", participant.id); // pastikan key adalah 'participants[]'
      });
      console.log("peserta:", participants);

      // Append files if any
      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append("fileRapat", file);
        });
      }
      console.log([...formData]); // Debug FormData sebelum dikirim

      console.log("Submitting data:", formData);

      // Create jadwal
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/jadwals`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
		  withCredentials: true,
        }
      );
      console.log("Jadwal added:", response.data);

      localStorage.removeItem("jadwalForm");
      navigate("/undangan");
    } catch (error) {
      console.error(
        "Error creating schedule:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <>
      <Title text="Buat Jadwal Rapat" />
      <FormContainer>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label htmlFor="tema">Tema Rapat</Label>
            <Input
              id="tema"
              {...register("tema", { required: true })}
              type="text"
              placeholder="Input Tema"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="tanggal">Tanggal Rapat</Label>
            <Input
              id="tanggal"
              {...register("tanggalRapat", { required: true })}
              type="date"
              min={new Date().toISOString().split("T")[0]} // Mengatur minimal tanggal yang bisa dipilih
            />
          </FormGroup>
          <FlexContainer>
            <FormGroup>
              <Label htmlFor="startTime">Waktu Rapat Mulai</Label>
              <Input
                id="startTime"
                {...register("waktuMulai", { required: true })}
                type="time"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="endTime">Waktu Rapat Selesai</Label>
              <Input
                id="endTime"
                {...register("waktuSelesai", { required: true })}
                type="time"
              />
            </FormGroup>
          </FlexContainer>
          {validateTimes() && <ErrorMessage>{validateTimes()}</ErrorMessage>}{" "}
          {/* Menampilkan pesan kesalahan waktu */}
          <FormGroup>
            <Label htmlFor="jenisRapat">Jenis Rapat</Label>
            <Select
              id="jenisRapat"
              {...register("jenisRapat", { required: true })}
              value={selectedJenisRapat}
            >
              <option value="">Pilih Jenis Rapat</option>
              {jenisRapat.map((jenis) => (
                <option key={jenis} value={jenis}>
                  {jenis === "offline" ? "Offline" : "Online"}
                </option>
              ))}
            </Select>
          </FormGroup>
          {selectedJenisRapat === "offline" && (
            <FormGroup>
              <Label htmlFor="lokasi">Lokasi Rapat</Label>
              <Input
                id="lokasi"
                {...register("lokasi", {
                  required: selectedJenisRapat === "offline",
                })}
                type="text"
                placeholder="Input Lokasi"
              />
            </FormGroup>
          )}
          {selectedJenisRapat === "online" && (
            <FormGroup>
              <Label htmlFor="link">Link Rapat Online</Label>
              <Input
                id="link"
                {...register("link", {
                  required: selectedJenisRapat === "online",
                })}
                type="url"
                placeholder="Input Link"
              />
            </FormGroup>
          )}
          <FormGroup>
            <Label>Peserta Rapat</Label>
            <ButtonWhiteBigHover onClick={handleAddParticipants}>
              Tambah Peserta
              <RiUserAddLine />
            </ButtonWhiteBigHover>

            {/* participants -> array daftar semua peserta, participant -> salah satu peserta */}
            {participants.length > 0 && (
              <>
                {participants.map((participant) => {
                  const participantsProfilePhoto = participant.profilePhoto
                    ? `${process.env.REACT_APP_API_URL}${participant.profilePhoto}`
                    : defaultAvatar;

                  return (
                    <ListPeserta key={participant.id}>
                      <Avatar
                        alt={participant.name}
                        src={participantsProfilePhoto}
                      />
                      <Name>{participant.name}</Name>
                      <PesertaIcon
                        onClick={() => removeParticipant(participant.id)}
                      >
                        <RiCloseFill />
                      </PesertaIcon>
                    </ListPeserta>
                  );
                })}
              </>
            )}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="files">Lampirkan File Rapat</Label>
            <Input
              id="files"
              type="file"
              multiple
              onChange={handleFileChange}
            />
            {files.length > 0 && (
              <div>
                <TableContainer>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHeaderCell>File Terlampir</TableHeaderCell>
                        <TableHeaderCell>Aksi</TableHeaderCell>
                      </TableRow>
                    </TableHeader>
                    <tbody>
                      {files.map((file, index) => (
                        <TableRow key={index}>
                          <TableCell>{file.name}</TableCell>
                          <TableCell>
                            <DeleteIcon onClick={() => handleRemoveFile(index)}>
                              <RiDeleteBinLine />
                            </DeleteIcon>
                          </TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </Table>
                </TableContainer>
              </div>
            )}
          </FormGroup>
          <FormGroup>
            <Label>Keterangan</Label>
            {/* tidak menggunakan register dari react-hook-form karena 
			Quill editor bukan merupakan elemen HTML standar (seperti <input>, <textarea>, dll.) 
			yang bisa langsung diintegrasikan dengan register */}
            <ReactQuill
              value={keterangan}
              onChange={setKeterangan}
              placeholder="Masukkan keterangan rapat"
            />
          </FormGroup>
          <ButtonPrimaryBigHover type="submit">
            Simpan
            <RiCalendarLine />
          </ButtonPrimaryBigHover>
        </Form>
      </FormContainer>
    </>
  );
};

export default AddJadwal;
