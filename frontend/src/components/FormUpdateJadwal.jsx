import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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

const UpdateJadwal = () => {
  const { id } = useParams(); // Ambil ID jadwal dari URL
  const { register, handleSubmit, setValue, watch } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const [jenisRapat, setJenisRapat] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [participantsToRemove, setParticipantsToRemove] = useState([]);
  const [files, setFiles] = useState([]);
  const [filesToRemove, setFilesToRemove] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  //   const { selectedParticipants = [] } = location.state || {}; // Ambil selectedParticipants dari state

  //selectedJenisRapat diambil dengan watch("jenisRapat") agar selalu sinkron dengan input form.
  const selectedJenisRapat = watch("jenisRapat"); // Mengawasi perubahan pada input jenis rapat
  const waktuMulai = watch("waktuMulai");
  const waktuSelesai = watch("waktuSelesai");

  const handleAddParticipants = () => {
    console.log("Tambah Peserta diklik");
    navigate("/tambah-peserta", {
      state: { selectedParticipants: participants, mode: "update", id },
    });
  };
  const removeParticipant = (id) => {
    setParticipants((prevParticipants) =>
      prevParticipants.filter((p) => p.id !== id)
    );
    setParticipantsToRemove((prevToRemove) => [...prevToRemove, id]);
  };
  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files); // Mengambil file baru dari input
    // Gabungkan file baru dengan file yang sudah ada
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };
  const handleRemoveFile = (index) => {
    const newFiles = [...files];
    const removedFile = newFiles.splice(index, 1)[0];

    console.log("Removed file:", removedFile); // Check what file is being removed

    if (typeof removedFile === "string" || removedFile instanceof File) {
      setFilesToRemove([...filesToRemove, removedFile]);
      console.log("Updated filesToRemove:", [...filesToRemove, removedFile]); // Log the updated array
    }

    setFiles(newFiles);
    console.log("Updated files:", newFiles); // Log the remaining files
  };

  useEffect(() => {
    // console.log("Selected participants on mount:", selectedParticipants);
    if (!id) {
      console.error("ID tidak ditemukan dalam URL");
      return;
    }
    console.log("User ID in useEffect:", id); // Tambahkan log ini juga

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

    const fetchJadwal = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("No access token found");
        }
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/jadwals/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
			withCredentials: true,
          }
        );
        const jadwal = response.data;
        console.log("Fetched jadwal:", jadwal); // Debugging the fetched user

        // Set value form sesuai data jadwal yang diambil
        setValue("tema", jadwal.tema);
        setValue("tanggalRapat", jadwal.tanggalRapat);
        setValue("waktuMulai", jadwal.waktuMulai);
        setValue("waktuSelesai", jadwal.waktuSelesai);
        setValue("jenisRapat", jadwal.jenisRapat);
        setValue("lokasi", jadwal.lokasi);
        setValue("link", jadwal.link);
        setValue("keterangan", jadwal.keterangan);
        setParticipants(jadwal.peserta || []); //menampilkan peserta pada form

        //meneruskan data dari halaman tambah peserta ke halaman form update jadwal menggunakan navigasi
        if (location.state && location.state.selectedParticipants) {
          setParticipants(location.state.selectedParticipants);
        }

        // Jika fileRapat bisa null atau undefined
        const fileNames = jadwal.fileRapat ? JSON.parse(jadwal.fileRapat) : [];
        setFiles(fileNames);
      } catch (error) {
        console.error("Error fetching jadwal:", error);
      }
    };

    fetchJenisRapat();
    fetchJadwal();
  }, [id, setValue, location.state]);

  useEffect(() => {
    // Validasi waktu secara real-time saat nilai waktu berubah
    if (waktuMulai && waktuSelesai) {
      if (
        new Date(`1970-01-01T${waktuMulai}`) >=
        new Date(`1970-01-01T${waktuSelesai}`)
      ) {
        setErrorMessage("Waktu mulai harus lebih awal dari waktu selesai");
      } else {
        setErrorMessage(""); // Hapus pesan error jika validasi berhasil
      }
    }
  }, [waktuMulai, waktuSelesai]);

  const onSubmit = async (data) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found");
      }
      console.log("Submitting data:", data);

      const formData = new FormData();
      Object.keys(data).forEach((key) => formData.append(key, data[key]));
      console.log("Selected jenis rapat:", selectedJenisRapat);

      // Tambahkan participants sebagai array ke FormData (sebagai array)
      participants.forEach((participant) => {
        formData.append("participants[]", participant.id); // pastikan key adalah 'participants[]'
      });
      console.log("peserta:", participants);

      participantsToRemove.forEach((participantId) =>
        formData.append("participantsToRemove[]", participantId)
      );

      // Append files if any
      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append("fileRapat", file);
        });
      }
      console.log("files:", files);

      if (filesToRemove.length > 0) {
        filesToRemove.forEach((file) => {
          formData.append("filesToRemove[]", file);
        });
      }
      console.log("Files to remove:", filesToRemove);

      console.log([...formData]); // Debug FormData sebelum dikirim
      console.log("Submitting data:", formData);

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/jadwals/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
		  withCredentials: true,
        }
      );
      console.log("Jadwal updated:", response.data);
      navigate("/undangan");
    } catch (error) {
      console.error(
        "Error submitting schedule:",
        error.response ? error.response.data : error.message
      );
    }
  };
  const BASE_URL = `${process.env.REACT_APP_API_URL}/uploads/`;
  return (
    <>
      <Title text="Update Jadwal Rapat" />
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
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}{" "}
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
                          <TableCell>
                            {typeof file === "string" ? (
                              <a //membuat hyperlink
                                href={`${BASE_URL}${file}`} //merujuk pada URL file yang akan dibuka ketika diklik. BASE_URL adalah base URL aplikasi Anda, yang digabungkan dengan file untuk menghasilkan URL lengkap
                                target="_blank" //tautan terbuka di tab baru
                                rel="noopener noreferrer" //keamanan dengan mencegah jendela baru yang dibuka memiliki akses ke objek window.opener halaman asli
                              >
                                {file.split("/").pop()}{" "}
                                {/* Menampilkan nama file dengan memecah string file berdasarkan garis miring (/) karna file adalah string (url file)*/}
                              </a>
                            ) : (
                              <span>{file.name}</span> // Untuk objek file baru
                            )}
                          </TableCell>
                          <TableCell>
                            <DeleteIcon
                              onClick={() =>
                                handleRemoveFile(index, file.name || file)
                              }
                            >
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
            <Label htmlFor="keterangan">Keterangan</Label>
            {/* tidak menggunakan register dari react-hook-form karena 
			Quill editor bukan merupakan elemen HTML standar (seperti <input>, <textarea>, dll.) 
			yang bisa langsung diintegrasikan dengan register */}
            <ReactQuill
              theme="snow"
              value={watch("keterangan")}
              //nilai keterangan sekarang diambil dari react-hook-form menggunakan watch("keterangan")
              onChange={(content) => setValue("keterangan", content)}
              //Setiap kali pengguna mengedit teks di ReactQuill, perubahan ini disimpan kembali ke react-hook-form dengan menggunakan setValue("keterangan", content)
              placeholder="Masukkan keterangan rapat"
            />
          </FormGroup>
          <ButtonPrimaryBigHover type="submit">
            Update
            <RiCalendarLine />
          </ButtonPrimaryBigHover>
        </Form>
      </FormContainer>
    </>
  );
};

export default UpdateJadwal;
