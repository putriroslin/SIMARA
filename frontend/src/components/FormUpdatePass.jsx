import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { RiSave3Line } from "react-icons/ri";
import { PiEyeFill, PiEyeSlashFill } from "react-icons/pi";
import axios from "axios";

const UbahPasswordParent = styled.form`
  width: 100%;
  margin-top: 20px;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  border-radius: 4px;
  background-color: #fff;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 16px;
  box-sizing: border-box;
  text-align: left;
  font-size: 16px;
`;
const Title = styled.b`
  align-self: stretch;
  position: relative;
  font-size: 20px;
  margin-bottom: 10px;
`;
const FormInputPassword = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin-bottom: 10px;
`;
const Label = styled.label`
  font-size: 15px;
  margin: 5px 0;
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
  padding: 5px;
  color: #5c5c5c;
`;
const InputPassword = styled.input`
  position: relative;
  line-height: 25px;
  width: 100%;
  border: none;
  outline: none;
`;
const EyeIcon = styled.div`
  width: 30px;
  height: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ErrorMessage = styled.h5`
  color: red;
  margin: 0;
`;
const FormButton = styled.button`
  align-self: stretch;
  border-radius: 4px;
  background-color: #0176c3;
  border: 1px solid #000;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 10px;
  gap: 8px;
  text-align: justify;
  font-size: 15px;
  color: #fff;
  cursor: pointer;
`;

const FormUpdatePass = () => {
  const [id, setId] = useState(null);
  console.log("User ID in useEffect:", id); // Tambahkan log ini juga

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const newPassword = watch("newPassword");

  useEffect(() => {
    const storedId = localStorage.getItem("id");
    console.log("Stored ID:", storedId);
    if (!storedId) {
      throw new Error("User ID is not available in localStorage");
    }
    setId(storedId);
  }, [id]);

  const onSubmit = async (data) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found");
      }
      console.log("Submitting data:", data);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/change-password`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
		  withCredentials: true,
        }
      );
      console.log("User updated:", response.data);
      alert("Password berhasil diubah");
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Gagal mengubah password");
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  return (
    <UbahPasswordParent onSubmit={handleSubmit(onSubmit)}>
      <Title>Ubah Password</Title>
      <FormInputPassword>
        <Label htmlFor="oldPassword">Password Lama</Label>
        <OutlineFormInputPlaceholder>
          <InputPassword
            id="oldPassword"
            type={showPassword.oldPassword ? "text" : "password"}
            placeholder="Input Password"
            {...register("oldPassword", {
              required: "Password lama wajib diisi",
            })}
          />
          <EyeIcon onClick={() => togglePasswordVisibility("oldPassword")}>
            {showPassword.oldPassword ? <PiEyeFill /> : <PiEyeSlashFill />}
          </EyeIcon>
        </OutlineFormInputPlaceholder>
        {errors.oldPassword && (
          <ErrorMessage>{errors.oldPassword.message}</ErrorMessage>
        )}{" "}
      </FormInputPassword>
      <FormInputPassword>
        <Label htmlFor="newPassword">Password Baru</Label>
        <OutlineFormInputPlaceholder>
          <InputPassword
            id="newPassword"
            type={showPassword.newPassword ? "text" : "password"}
            placeholder="Input Password"
            {...register("newPassword", {
              required: "Password baru wajib diisi",
            })}
          />
          <EyeIcon onClick={() => togglePasswordVisibility("newPassword")}>
            {showPassword.newPassword ? <PiEyeFill /> : <PiEyeSlashFill />}
          </EyeIcon>
        </OutlineFormInputPlaceholder>
        {errors.newPassword && (
          <ErrorMessage>{errors.newPassword.message}</ErrorMessage>
        )}{" "}
      </FormInputPassword>
      <FormInputPassword>
        <Label htmlFor="confirmNewPassword">Konfirmasi Password Baru</Label>
        <OutlineFormInputPlaceholder>
          <InputPassword
            id="confirmNewPassword"
            type={showPassword.confirmNewPassword ? "text" : "password"}
            placeholder="Input Password"
            {...register("confirmNewPassword", {
              required: "Konfirmasi password wajib diisi",
              validate: (value) =>
                value === newPassword || "Konfirmasi password tidak cocok",
            })}
          />
          <EyeIcon
            onClick={() => togglePasswordVisibility("confirmNewPassword")}
          >
            {showPassword.confirmNewPassword ? (
              <PiEyeFill />
            ) : (
              <PiEyeSlashFill />
            )}
          </EyeIcon>
        </OutlineFormInputPlaceholder>
        {errors.confirmNewPassword && (
          <ErrorMessage>{errors.confirmNewPassword.message}</ErrorMessage>
        )}
      </FormInputPassword>
      <FormButton type="submit">
        Simpan Password
        <RiSave3Line />
      </FormButton>
    </UbahPasswordParent>
  );
};

export default FormUpdatePass;
