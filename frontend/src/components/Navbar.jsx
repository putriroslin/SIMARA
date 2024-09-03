import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/logo_ap2-removebg.png";
import defaultAvatar from "../assets/pngwing.com.png"; // Default avatar jika profil tidak ada
import { RiCloseFill, RiMenuFill } from "react-icons/ri";
import { CiGrid41 } from "react-icons/ci";
import {
  FaLocationArrow,
  FaRegClock,
  FaRegFileAlt,
  FaUsers,
  FaRegBell,
} from "react-icons/fa";

const AppBarAvatarRoot = styled.div``;
const NavBarRoot = styled.div`
  width: 100%;
  height: 70px;
  position: fixed;
  background-color: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 0 10px;
  box-sizing: border-box;
  gap: 16px;
  z-index: 105;
`;
const ImageLogo = styled.img`
  width: auto;
  position: relative;
  height: 50px;
  object-fit: cover;
`;
const NavBarChild = styled.div`
  align-self: stretch;
  flex: 1;
  position: relative;
  background-color: rgba(255, 255, 255, 0.01);
`;
const NavBarLink = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #5c5c5c;
`;
const DropdownAppBarRoot = styled.b`
  position: absolute;
  top: 70px; /* Adjust based on your layout */
  right: 0px;
  padding: 5px;
  transition: 0.3s ease-in-out;
  z-index: 101;
  display: ${({ $isVisible }) =>
    $isVisible ? "flex" : "none"}; /* Show or hide based on state */
`;
const Logout = styled.button`
  background-color: #fff;
  text-align: left;
  color: #ef4444;
  width: 115px;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
`;
const ImageAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  padding: 10px;
`;
const MenuIcon = styled.div`
  width: auto;
  height: 70px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const OffcanvasMenuRoot = styled.ul`
  position: fixed;
  top: 55px;
  right: ${({ $isOpen }) => ($isOpen ? "0" : "-300px")};
  width: 200px;
  height: 100vh;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: 0.3s ease-in-out;
  z-index: 101;
`;
const OffcanvasMenuItem = styled.li`
  margin-bottom: 20px;
  list-style: none;
  position: relative;
`;
const OffcanvasMenuLink = styled(NavLink)`
  display: flex;
  align-items: center; /* Align items vertically */
  color: #5c5c5c;
  text-decoration: none;
  transition: 0.3s ease-in-out;
  cursor: pointer;
  position: relative;
  &.active {
    padding: 5px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    color: #fff;
    background-color: #0176c3;
  }
  &:hover::after {
    content: "";
    width: 30%;
    height: 2px;
    background: #0176c3;
    position: absolute;
    bottom: -5px;
    left: 0px;
  }
`;
const Line = styled.div`
  width: 100%;
  height: 2px;
  background: #0176c3;
  margin-bottom: 20px;
`;
const OffcanvasMenuIcon = styled.span`
  margin-right: 10px;
`;
const OffCanvasMenuLogout = styled.button`
  position: relative;
  cursor: pointer;
  color: #fff;
  border: none;
  border-radius: 5px;
  width: 100%;
  background-color: #ef4444;
  padding: 8px 16px; /* Add some padding for better hover effect */
  box-sizing: border-box;
`;

const NavBar = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isOffcanvasOpen, setOffcanvasOpen] = useState(false);
  const [role, setRole] = useState(""); // Ubah nilai sesuai kebutuhan
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(defaultAvatar);
  const navigate = useNavigate();

  useEffect(() => {
    // Ambil role dari localStorage saat komponen pertama kali di-render
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    const storedProfilePhoto = localStorage.getItem("profilePhoto");
    setRole(role);
    setName(name);
    // Set profile photo
    if (storedProfilePhoto && storedProfilePhoto !== "null") {
      setProfilePhoto(`${process.env.REACT_APP_API_URL}${storedProfilePhoto}`);
    } else {
      setProfilePhoto(defaultAvatar);
    }
  }, []);

  // membuka dan menutup menu offcanvas ketika ikon menu diklik
  const handleMenuIconClick = () => {
    setOffcanvasOpen(!isOffcanvasOpen);
  };

  //menangani klik pada item menu di dalam offcanvas
  const handleMenuItemClick = () => {
    setOffcanvasOpen(false); // Close the menu
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("id");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      localStorage.removeItem("unitId");
      localStorage.removeItem("status");
      localStorage.removeItem("profilePhoto");

      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AppBarAvatarRoot>
      <NavBarRoot>
        <NavBarLink to="/">
          <ImageLogo alt="" src={logo} />
        </NavBarLink>
        <NavBarChild />
        {/* jika benar superadmin */}
        {role === "superadmin" ? (
          <>
            <NavBarLink
              to="/profil"
              onMouseEnter={() => setDropdownVisible(true)}
              onMouseLeave={() => setDropdownVisible(false)}
            >
              <ImageAvatar
                // dropdown muncul ketika kursor diarahkan ke avatar
                alt=""
                src={profilePhoto} // Menggunakan foto profil dari state
              />
              {name}
            </NavBarLink>

            <DropdownAppBarRoot
              $isVisible={isDropdownVisible}
              onMouseEnter={() => setDropdownVisible(true)}
              onMouseLeave={() => setDropdownVisible(false)}
            >
              <Logout onClick={handleLogout}>Logout</Logout>
            </DropdownAppBarRoot>
          </>
        ) : (
          //bukan superadmin
          <MenuIcon onClick={handleMenuIconClick}>
            {isOffcanvasOpen ? <RiCloseFill /> : <RiMenuFill />}
          </MenuIcon>
        )}
      </NavBarRoot>
      {/* jika benar bukan superadmin (opeartor&karyawan)*/}
      {role !== "superadmin" && (
        <OffcanvasMenuRoot $isOpen={isOffcanvasOpen}>
          <OffcanvasMenuItem>
            <OffcanvasMenuLink to="/profil" onClick={handleMenuItemClick}>
              <ImageAvatar alt="" src={profilePhoto} />
              {name}
            </OffcanvasMenuLink>
          </OffcanvasMenuItem>
          <Line />
          <OffcanvasMenuItem>
            <OffcanvasMenuLink to="/" onClick={handleMenuItemClick}>
              <OffcanvasMenuIcon>
                <CiGrid41 />
              </OffcanvasMenuIcon>
              Home
            </OffcanvasMenuLink>
          </OffcanvasMenuItem>
          <OffcanvasMenuItem>
            <OffcanvasMenuLink to="/notifikasi" onClick={handleMenuItemClick}>
              <OffcanvasMenuIcon>
                <FaRegBell />
              </OffcanvasMenuIcon>
              Notifikasi
            </OffcanvasMenuLink>
          </OffcanvasMenuItem>
          <OffcanvasMenuItem>
            <OffcanvasMenuLink to="/undangan" onClick={handleMenuItemClick}>
              <OffcanvasMenuIcon>
                <FaLocationArrow />
              </OffcanvasMenuIcon>
              Undangan Rapat
            </OffcanvasMenuLink>
          </OffcanvasMenuItem>
          <OffcanvasMenuItem>
            <OffcanvasMenuLink to="/riwayat" onClick={handleMenuItemClick}>
              <OffcanvasMenuIcon>
                <FaRegClock />
              </OffcanvasMenuIcon>
              Riwayat Rapat
            </OffcanvasMenuLink>
          </OffcanvasMenuItem>
          <OffcanvasMenuItem>
            <OffcanvasMenuLink to="/jadwal" onClick={handleMenuItemClick}>
              <OffcanvasMenuIcon>
                <FaRegFileAlt />
              </OffcanvasMenuIcon>
              Tugas Rapat
            </OffcanvasMenuLink>
          </OffcanvasMenuItem>
          {/* jika benar bukan karyawan */}
          {role !== "karyawan" && (
            <OffcanvasMenuItem>
              <OffcanvasMenuLink
                to="/kelola-karyawan"
                onClick={handleMenuItemClick}
              >
                <OffcanvasMenuIcon>
                  <FaUsers />
                </OffcanvasMenuIcon>
                Kelola Karyawan
              </OffcanvasMenuLink>
            </OffcanvasMenuItem>
          )}
          <OffCanvasMenuLogout onClick={handleLogout}>
            Logout
          </OffCanvasMenuLogout>
        </OffcanvasMenuRoot>
      )}
    </AppBarAvatarRoot>
  );
};

export default NavBar;
