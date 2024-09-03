import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import styled from "styled-components";
import defaultAvatar from "../assets/pngwing.com.png";
import { MdEdit } from "react-icons/md";
import FormUpdatePass from "../components/FormUpdatePass";
import NavBar from "../components/Navbar";

const ProfileAvatarParent = styled.div`
  align-self: stretch;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  border-radius: 4px;
  background-color: #fff;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const ProfileAvatar = styled.div`
  width: 144px;
  position: relative;
  height: 144px;
`;

const ProfileAvatarChild = styled.img`
  position: absolute;
  top: 0%;
  right: 0%;
  bottom: 0%;
  left: 0%;
  border-radius: 50%;
  width: 100%;
  height: 100%;
  overflow: hidden;
  object-fit: cover;
`;

const EditFillWrapper = styled.div`
  position: absolute;
  height: 25%;
  width: 25%;
  top: 75%;
  right: 0%;
  bottom: 0%;
  left: 75%;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  border-radius: 50px;
  background-color: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 10px;
  box-sizing: border-box;
  cursor: pointer;
`;

const Name = styled.b`
  align-self: stretch;
  position: relative;
  font-size: 20px;
  margin-top: 10px;
`;

const GroupParent = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  font-size: 15px;
  margin-top: 10px;
  white-space: nowrap;
`;

const Group = styled.div`
  flex: 1;
  position: relative;
  height: 40px;
`;

const Data = styled.span`
  display: block;
  margin-top: 5px;
`;

const ProfileParentRoot = styled.div`
  height: 100%;
  position: relative;
  background-color: #f8f8f8;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 16px;
  box-sizing: border-box;
  text-align: center;
  font-size: 18px;
  color: #000;
  font-family: Inter;
`;

const ProfileRoot = styled.div`
  padding-top: 70px;
`;

const Profile = () => {
  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(defaultAvatar);
  const { register } = useForm();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedId = localStorage.getItem("id");
    console.log("Stored ID:", storedId);
    if (!storedId) {
      throw new Error("User ID is not available in localStorage");
    }
    setId(storedId);

    const storedRole = localStorage.getItem("role");
    console.log("Stored Role:", storedRole);
    setRole(storedRole);

    const name = localStorage.getItem("name");
    const unitId = localStorage.getItem("unitId");
    const email = localStorage.getItem("email");
    const storedProfilePhoto = localStorage.getItem("profilePhoto");

    console.log("Stored Name:", name);
    console.log("Stored Email:", email);
    console.log("Stored Profile Photo:", storedProfilePhoto);

    setName(name || "Nama Default");
    setEmail(email || "Email Default");

    // Cek apakah profilePhoto ada di localStorage
    if (storedProfilePhoto && storedProfilePhoto !== "null") {
      setProfilePhoto(`${process.env.REACT_APP_API_URL}${storedProfilePhoto}`);
    } else {
      setProfilePhoto(defaultAvatar);
    }

    if (storedRole !== "superadmin" && unitId) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/units/${unitId}`, {
          withCredentials: true, // Pastikan kredensial dikirim
        })
        .then((response) => {
          console.log("Fetched Unit Name:", response.data.nameUnit);
          setUnit(response.data.nameUnit);
        })
        .catch((error) => {
          console.error("Error fetching unit name:", error);
          setUnit("Unit Default");
        });
    } else {
      setUnit("Unit Default");
    }
  }, [profilePhoto]);

  const onFileChange = async (event) => {
    const file = event.target.files[0];
    console.log("Selected file:", file);
    const formData = new FormData();
    formData.append("profilePhoto", file);

    try {
      const accessToken = localStorage.getItem("accessToken");
      console.log("Access Token:", accessToken);
      if (!accessToken) {
        throw new Error("No access token found");
      }
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/upload/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
		  withCredentials: true,
        }
      );
      console.log("Upload response:", response.data);
      const newProfilePhoto = response.data.profilePhotoUrl;
      setProfilePhoto(`${process.env.REACT_APP_API_URL}${newProfilePhoto}`);
      localStorage.setItem("profilePhoto", newProfilePhoto);
    } catch (error) {
      console.error("Error uploading:", error);
    }
  };

  return (
    <>
      <NavBar />
      <ProfileRoot>
        <ProfileParentRoot>
          <ProfileAvatarParent>
            <ProfileAvatar>
              <ProfileAvatarChild
                alt=""
                src={profilePhoto}
                onError={() => setProfilePhoto(defaultAvatar)}
              />
              <EditFillWrapper>
                <MdEdit onClick={() => fileInputRef.current.click()} />
                <input
                  type="file"
                  {...register("profilePhoto")}
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={onFileChange}
                />
              </EditFillWrapper>
            </ProfileAvatar>
            <Name>{name}</Name>
            <GroupParent>
              {role !== "superadmin" && (
                <Group>
                  <b>Unit</b>
                  <Data>{unit}</Data>
                </Group>
              )}
              <Group>
                <b>Email</b>
                <Data>{email}</Data>
              </Group>
            </GroupParent>
          </ProfileAvatarParent>
          <FormUpdatePass />
        </ProfileParentRoot>
      </ProfileRoot>
    </>
  );
};

export default Profile;
