import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { RiUserAddLine } from "react-icons/ri";
import { PiEyeFill, PiEyeSlashFill } from "react-icons/pi";
import styled from "styled-components";
import axios from "axios";

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
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #9c9c9c;
  color: #5c5c5c;
  font-size: 15px;
`;
const OutlineFormInputPlaceholder = styled.div`
  align-self: stretch;
  border-radius: 4px;
  background-color: #fff;
  border: 1px solid #9c9c9c;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 10px;
`;
const FormInput = styled.input`
  position: relative;
  //   line-height: 25px;
  width: 100%;
  border: none;
  outline: none;
  color: #5c5c5c;
  font-size: 15px;
`;
const EyeIcon = styled.div`
  width: 20px;
  height: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5c5c5c;
`;
const Button = styled.button`
  border-radius: 4px;
  background-color: #0176c3;
  border: 1px solid #000;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  gap: 10px;
  font-size: 15px;
  width: 100%;
`;

const FormAddUser = () => {
  const [role, setRole] = useState("");
  const [units, setUnits] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    const fetchUnits = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("No access token found");
        }
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/units`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
			withCredentials: true,
          }
        );
        setUnits(response.data);
      } catch (error) {
        console.error("Error fetching units:", error);
      }
    };

    const fetchStatuses = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("No access token found");
        }
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/statuses`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
			withCredentials: true,
          }
        );
        setStatuses(response.data);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };

    fetchUnits();
    fetchStatuses();
  }, []);

  const onSubmit = async (data) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found");
      }
      console.log("Submitting data:", data);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/users`,
        {
          ...data,
          role: role === "superadmin" ? "operator" : "karyawan",
          // field role secara langsung dalam request data, dengan nilai operator jika role adalah superadmin, dan karyawan jika role bukan superadmin
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
		  withCredentials: true,
        }
      );
      console.log("User added:", response.data);

      if (role === "superadmin") {
        navigate("/kelola-operator");
      } else {
        navigate("/kelola-karyawan");
      }
    } catch (error) {
      console.error(
        "Error adding user:",
        error.response ? error.response.data : error.message
      );
    }
  };

  console.log("Form role:", role); // role pengguna yang login

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label htmlFor="nama">Nama User</Label>
          <Input
            id="nama"
            {...register("name", { required: true })}
            type="text"
            placeholder="Input Nama"
            autoComplete="name"
          />
        </FormGroup>
        {role === "superadmin" && (
          <FormGroup>
            <Label htmlFor="unitKerja">Unit Kerja</Label>
            <Select id="unitKerja" {...register("unit", { required: true })}>
              <option value="">Pilih Unit Kerja</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.nameUnit}>
                  {unit.nameUnit}
                </option>
              ))}
            </Select>
          </FormGroup>
        )}
        <FormGroup>
          <Label htmlFor="statusUser">
            {role === "superadmin" ? "Status Operator" : "Status Karyawan"}
          </Label>
          <Select id="statusUser" {...register("status", { required: true })}>
            <option value="">Pilih Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === "active" ? "Aktif" : "Tidak Aktif"}
              </option>
            ))}
          </Select>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="email">Email User</Label>
          <Input
            id="email"
            {...register("email", { required: true })}
            type="email"
            placeholder="Input Email"
            autoComplete="email"
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <OutlineFormInputPlaceholder>
            <FormInput
              id="password"
              {...register("password", { required: true })}
              type={showPassword ? "text" : "password"}
              placeholder="Input Password"
            />
            <EyeIcon onClick={togglePasswordVisibility}>
              {showPassword ? <PiEyeFill /> : <PiEyeSlashFill />}
            </EyeIcon>
          </OutlineFormInputPlaceholder>
        </FormGroup>
        <Button type="submit">
          Simpan User
          <RiUserAddLine />
        </Button>
      </Form>
    </FormContainer>
  );
};

export default FormAddUser;
