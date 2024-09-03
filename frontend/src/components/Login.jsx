import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import bg from "../assets/bg.png";
import logo from "../assets/logo_ap2-removebg.png";
import { RiLoginCircleFill } from "react-icons/ri";
import { PiEyeFill, PiEyeSlashFill } from "react-icons/pi";

const LoginContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow-y: auto;
  text-align: left;
  color: #fff;
  font-family: "Nunito Sans";
  display: flex;
  justify-content: center;
  align-items: center;
`;
const BackgroundImage = styled.img`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
`;
const BackgroundOverlay = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.01);
`;
const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  height: auto;
  margin: 0 auto;
  border-radius: 16px;
  backdrop-filter: blur(25px);
  background-color: rgba(0, 0, 0, 0.5);
  border: 2px solid #000;
  box-sizing: border-box;
  text-align: left;
`;
const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  background-color: #fff;
  border-radius: 14px 14px 0px 0px;
`;
const LogoImage = styled.img`
  width: 70%;
  height: auto;
  margin: auto;
  padding: 10px 0;
`;
const FormContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  padding: 10px 0;
`;
const FormTitle = styled.p`
  position: relative;
  font-size: 25px;
  margin: 5px 0;
`;
const FormLabel = styled.label`
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
  padding: 3px;
  color: #5c5c5c;
`;
const FormInput = styled.input`
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
const FormButton = styled.button`
  position: relative;
  padding: 8px;
  margin: 10px 0px;
  border-radius: 5px;
  font-size: 15px;
  border: none;
  color: #fff;
  background-color: #0176c3;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;
const ErrorMessage = styled.h5`
  color: red;
  margin: 0;
`;

const Login = ({ onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register, //menghubungkan input form dengan sistem manajemen state dan validasi dari react-hook-form
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  //menangani pengiriman form dan melakukan autentikasi dengan server menggunakan axios
  const onSubmit = async (data) => {
    console.log("test", process.env.REACT_APP_API_URL);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        {
          email: data.email,
          password: data.password,
        },
        {
          withCredentials: true, // Pastikan kredensial dikirim
        }
      );

      console.log("Response Data:", response.data);

      const {
        accessToken,
        refreshToken,
        id,
        name,
        email,
        role,
        unitId,
        status,
        profilePhoto,
      } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("id", id);
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("role", role);
      localStorage.setItem("unitId", unitId);
      localStorage.setItem("status", status);
      localStorage.setItem("profilePhoto", profilePhoto);

      // alert("Login Berhasil");
      // Panggil fungsi onLoginSuccess setelah login berhasil
      if (onLoginSuccess) {
        onLoginSuccess(id);
      }
      navigate("/");
    } catch (error) {
      if (error.response) {
        setError("apiError", { message: error.response.data.msg });
      }
    }
  };

  const handleInputChange = () => {
    clearErrors("apiError");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <LoginContainer>
      <BackgroundImage src={bg} alt="Background" />
      <BackgroundOverlay />
      <FormWrapper onSubmit={handleSubmit(onSubmit)}>
        <LogoContainer>
          <LogoImage src={logo} alt="Logo" />
        </LogoContainer>
        <FormContent>
          <FormTitle>
            <b>Login</b>
          </FormTitle>
          <FormLabel htmlFor="email">Email</FormLabel>
          <OutlineFormInputPlaceholder>
            <FormInput
              type="text"
              id="email"
              placeholder="Email"
              {...register("email", { required: "Masukkan Email" })}
              onChange={handleInputChange}
              autoComplete="on"
            />
          </OutlineFormInputPlaceholder>
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}

          <FormLabel htmlFor="password">Password</FormLabel>
          <OutlineFormInputPlaceholder>
            <FormInput
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Password"
              {...register("password", { required: "Masukkan Password" })}
              onChange={handleInputChange}
              autoComplete="off"
            />
            <EyeIcon onClick={togglePasswordVisibility}>
              {showPassword ? <PiEyeFill /> : <PiEyeSlashFill />}
            </EyeIcon>
          </OutlineFormInputPlaceholder>
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}

          <FormButton type="submit">
            Login
            <RiLoginCircleFill />
          </FormButton>
          {errors.apiError && (
            <ErrorMessage>{errors.apiError.message}</ErrorMessage>
          )}
        </FormContent>
      </FormWrapper>
    </LoginContainer>
  );
};

export default Login;
