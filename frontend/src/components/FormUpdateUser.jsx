import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { RiUserAddLine } from "react-icons/ri";
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

const FormUpdateUser = () => {
  const { id } = useParams();
  const [role, setRole] = useState("");
  const [units, setUnits] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [showReason, setShowReason] = useState(false); // State to manage reason input visibility
  const { register, handleSubmit, setValue, watch } = useForm();
  const navigate = useNavigate();
  const status = watch("status");

  useEffect(() => {
    if (status === "inactive") {
      setShowReason(true);
    } else {
      setShowReason(false);
    }
  }, [status]);
  console.log("Show reason:", showReason);
  console.log("Alasan inactive value:", watch("alasanInactive"));

  useEffect(() => {
    console.log("User ID in useEffect:", id); // Tambahkan log ini juga

    const storedRole = localStorage.getItem("role");
    console.log("Stored role in UpdateUser:", storedRole);
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
        console.log("Units data:", response.data);
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
        console.log("Statuses data:", response.data);
        setStatuses(response.data);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };

    // Define fetch functions
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("No access token found");
        }
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
			withCredentials: true,
          }
        );
        const user = response.data;
        console.log("Fetched user:", user); // Debugging the fetched user
        setValue("name", user.name);
        setValue("email", user.email);
        setValue("status", user.status);
        if (user.unit && user.unit.nameUnit) {
          setValue("unit", user.unit.nameUnit);
        }
        // Set showReason and value for alasanInactive
        if (user.status === "inactive") {
          setShowReason(true);
          setValue("alasanInactive", user.alasanInactive || ""); // Set empty string if alasanInactive is not provided
        } else {
          setShowReason(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Fetch units
    // console.log("Fetching units data");
    fetchUnits();
    // Fetch statuses
    // console.log("Fetching statuses data");
    fetchStatuses();
    // Fetch user
    // console.log("Fetching user data");
    fetchUser();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found");
      }
      console.log("Submitting data:", data);
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/users/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
		  withCredentials: true,
        }
      );
      console.log("User updated:", response.data);

      if (role === "superadmin") {
        navigate("/kelola-operator");
      } else {
        navigate("/kelola-karyawan");
      }
    } catch (error) {
      console.error(
        "Error updating user:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <FormGroup>
          <Label htmlFor="name">Nama User</Label>
          <Input
            id="name"
            {...register("name", { required: true })}
            type="text"
            placeholder="Input Nama"
            autoComplete="name"
          />
        </FormGroup>
        {role === "superadmin" && (
          <FormGroup>
            <Label htmlFor="unitKerja">Unit Kerja</Label>
            <Select
              id="unitKerja"
              {...register("unit", { required: true })} //"unit" adalah nama field yang digunakan dalam form state.
              autoComplete="unit"
            >
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
          <Select
            id="statusUser"
            {...register("status", { required: true })}
            autoComplete="status"
          >
            <option value="">Pilih Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === "active" ? "Aktif" : "Tidak Aktif"}
              </option>
            ))}
          </Select>
        </FormGroup>
        {showReason && (
          <FormGroup>
            <Label htmlFor="alasanInactive">Alasan Tidak Aktif</Label>
            <Input
              id="alasanInactive"
              {...register("alasanInactive")}
              type="text"
              placeholder="Masukkan alasan tidak aktif"
              autoComplete="alasanInactive"
            />
          </FormGroup>
        )}
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            {...register("email", { required: true })}
            type="email"
            placeholder="Input Email"
            autoComplete="email"
          />
        </FormGroup>
        <Button type="submit">
          Update User
          <RiUserAddLine />
        </Button>
      </Form>
    </FormContainer>
  );
};

export default FormUpdateUser;
