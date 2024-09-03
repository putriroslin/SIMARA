import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import { RiUserAddLine, RiCalendarLine, RiCloseFill } from "react-icons/ri";
import { RiCalendarLine } from "react-icons/ri";
import styled from "styled-components";
import axios from "axios";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
import Title from "./TitlePage";

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
// const Quill = styled(ReactQuill)`
//   .ql-container {
//     background-color: white;
//   }
// `;
const Button = styled.div`
  position: relative;
  line-height: 24px;
  cursor: pointer;
  gap: 10px;
`;
// const ButtonWhiteBigHover = styled.div`
//   width: 150px;
//   border-radius: 4px;
//   background-color: #fff;
//   border: 1px solid #0176c3;
//   box-sizing: border-box;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   padding: 10px;
//   font-size: 15px;
//   color: #0176c3;
//   gap: 10px;
//   cursor: pointer;
// `;
const ButtonPrimaryBigHover = styled.div`
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
`;
// const Table = styled.table`
//   width: 100%;
//   border-collapse: collapse;
//   border: 1px solid #000;
// `;
// const TableHeader = styled.thead``;
// const TableRow = styled.tr``;
// const TableHeaderCell = styled.th`
//   padding: 12px;
//   border: 1px solid #000;
//   text-align: left;
//   font-size: 15px;
//   background-color: #ebebe4;
// `;
// const TableCell = styled.td`
//   padding: 12px;
//   border: 1px solid #000;
//   text-align: left;
//   font-size: 15px;
//   background-color: white;
// `;
// const TableContainer = styled.div`
//   width: 100%;
//   overflow-x: auto;
//   margin: 10px 0;
// `;
// const Avatar = styled.img`
//   width: 25px;
//   position: relative;
//   border-radius: 50px;
//   height: 25px;
//   object-fit: cover;
// `;
// const Name = styled.b`
//   position: relative;
//   align-self: stretch;
//   flex: 1;
//   display: flex;
//   flex-direction: column;
//   align-items: flex-start;
//   justify-content: center;
//   font-size: 15px;
// `;
// const PesertaIcon = styled.div`
//   border-radius: 50px;
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   justify-content: center;
//   padding: 5px;
//   position: relative;
//   object-fit: cover;
//   cursor: pointer;
//   color: #9c9c9c;
// `;
// const ListPeserta = styled.div`
//   width: 100%;
//   border-radius: 4px;
//   background-color: #fff;
//   display: flex;
//   flex-direction: row;
//   align-items: flex-start;
//   justify-content: flex-start;
//   padding: 10px;
//   margin: 10px 0;
//   box-sizing: border-box;
//   gap: 15px;
// `;

const FormJadwal = ({ isUpdate }) => {
  const [jenisRapat, setJenisRapat] = useState([]);
  const [selectedJenisRapat, setSelectedJenisRapat] = useState(""); // State untuk jenis rapat yang dipilih
  //   const [value, setValue] = useState("");
  //   const [selectedFiles, setSelectedFiles] = useState([]);
  //   const [peserta, setpeserta] = useState(false);
  const { register, handleSubmit } = useForm();
  //   const navigate = useNavigate();

  const handleJenisRapatChange = (e) => {
    setSelectedJenisRapat(e.target.value);
  };

  //   const handleFileChange = (e) => {
  //     setSelectedFiles(Array.from(e.target.files));
  //   };

  //   const handlePeserta = () => {
  //     navigate("/peserta");
  //     setpeserta(true);
  //   };
  //   const handleRemovePeserta = () => {
  //     // Logika untuk menghapus peserta
  //     setpeserta(false);
  //   };

  useEffect(() => {
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
  }, []);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("tema", data.tema);
      formData.append("tanggal", data.tanggalRapat);
      formData.append("startTime", data.waktuMulai);
      formData.append("endTime", data.waktuSelesai);
      formData.append("jenisRapat", data.jenisRapat);
      if (data.jenisRapat === "offline") {
        formData.append("lokasi", data.lokasi);
      } else {
        formData.append("link", data.link);
      }
      //   selectedFiles.forEach((fileRapat) => {
      //     formData.append("fileRapat", fileRapat);
      //   });
      //   formData.append("keterangan", value);

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found");
      }
      console.log("Submitting data:", data);

      const url = isUpdate
        ? `${process.env.REACT_APP_API_URL}/jadwals/${data.id}`
        : `${process.env.REACT_APP_API_URL}/jadwals`;
      const method = isUpdate ? "put" : "post";

      const response = await axios({
        method,
        url,
        data: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
		withCredentials: true,
      });

      console.log(
        isUpdate ? "Schedule updated:" : "Schedule created:",
        response.data
      );
    } catch (error) {
      console.error(
        isUpdate ? "Error updating schedule:" : "Error creating schedule:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <>
      <Title text={isUpdate ? "Edit Jadwal Rapat" : "Buat Jadwal Rapat"} />
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
              {...register("tanggal", { required: true })}
              type="date"
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
          <FormGroup>
            <Label htmlFor="jenisRapat">Jenis Rapat</Label>
            <Select
              id="jenisRapat"
              {...register("jenisRapat", { required: true })}
              value={selectedJenisRapat}
              onChange={handleJenisRapatChange}
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
          {/* <FormGroup>
            <Label>Peserta Rapat</Label>
            <ButtonWhiteBigHover onClick={handlePeserta}>
              Tambah Peserta
              <RiUserAddLine />
            </ButtonWhiteBigHover>

            {peserta && (
              <ListPeserta>
                <Avatar alt="" src="bg.png" />
                <Name>Iqbalibul</Name>
                <PesertaIcon onClick={handleRemovePeserta}>
                  <RiCloseFill />
                </PesertaIcon>
              </ListPeserta>
            )}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="fileUpload">Upload File Rapat</Label>
            <Input
              id="fileUpload"
              {...register("file", { required: true })}
              type="file"
              multiple
              onChange={handleFileChange}
            />
            {selectedFiles.length > 0 && (
              <TableContainer>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell>File Terlampir</TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <tbody>
                    {selectedFiles.map((file, index) => (
                      <TableRow key={index}>
                        <TableCell>{file.name}</TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </Table>
              </TableContainer>
            )}
            <Quill
              theme="snow"
              {...register("keterangan", { required: true })}
              placeholder="Input Keterangan"
              value={value}
              onChange={setValue}
            />
          </FormGroup> */}
          <ButtonPrimaryBigHover type="submit">
            <Button>{isUpdate ? "Update" : "Simpan"}</Button>
            <RiCalendarLine />
          </ButtonPrimaryBigHover>
        </Form>
      </FormContainer>
    </>
  );
};

export default FormJadwal;
