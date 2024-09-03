import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import bg from "../assets/bg.png";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import NavBar from "../components/Navbar";
import { askNotificationPermission, subscribeUserToPush } from "../helpers/pushSubscriptionHelper";

const ManagementRapat = styled.p`
  margin: 0;
`;
const ManagementRapatAngkasaContainer = styled.div`
  position: relative;
  line-height: 36px;
  font-weight: 600;
`;
const NameApp = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 10px;
`;
const Button = styled.div`
  position: relative;
  line-height: 24px;
  cursor: pointer;
`;
const ButtonIcon = styled.span`
  margin-left: 10px;
`;
const ButtonWhiteBigHover = styled.div`
  width: auto;
  border-radius: 4px;
  background-color: #fff;
  border: 1px solid #0176c3;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 16px 12px;
  gap: 8px;
`;
const ButtonPrimaryBigHover = styled.div`
  border-radius: 4px;
  background-color: #0176c3;
  border: 1px solid #000;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 16px 12px;
  gap: 8px;
  color: #fff;
`;
const ButtonWhiteBigHoverParent = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  gap: 16px;
  text-align: justify;
  font-size: 15px;
  color: #0176c3;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  gap: 16px;
  /* memposisikan form ditengah layar */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const Background = styled.img`
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  object-fit: cover; /*mempertahankan rasio aspek*/
  z-index: -1; /* Place background behind content */
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  filter: brightness(0.5);
`;
const HomeRoot = styled.div`
  padding-top: 70px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  height: calc(
    100vh - 70px
  ); /* Adjust this based on your navbar/logo-header height */
  font-size: 28px;
  text-align: center;
  color: #fff;
  overflow: hidden;
  white-space: nowrap;
`;

const Home = ({ userId }) => {
  const [role, setRole] = useState(""); // Ubah nilai sesuai kebutuhan
  const navigate = useNavigate();

  useEffect(() => {
    // Ambil role dari localStorage saat komponen pertama kali di-render
    const role = localStorage.getItem("role");
    setRole(role);

	if (userId) {
		askNotificationPermission().then((permissionGranted) => {
		  if (permissionGranted) {
			subscribeUserToPush(userId);
		  }
		}).catch((error) => {
		  console.error("Notification permission denied or error occurred:", error);
		});
	  }
  }, [userId]);

  const handleKelolaOperator = () => {
    navigate("/kelola-operator");
  };

  const handleJadwal = () => {
	navigate("/undangan")
  }

  return (
    <>
	<NavBar />
      <HomeRoot>
        <Background alt="" src={bg} />
        <Container>
          <NameApp>
            <ManagementRapatAngkasaContainer>
              <ManagementRapat>Management Rapat</ManagementRapat>
              <ManagementRapat>Angkasa Pura II</ManagementRapat>
            </ManagementRapatAngkasaContainer>
          </NameApp>
          {role === "superadmin" ? (
            <ButtonWhiteBigHoverParent>
              <ButtonWhiteBigHover>
                <Button onClick={handleKelolaOperator}>
                  Kelola Operator
                  <ButtonIcon>
                    <FaArrowUpRightFromSquare />
                  </ButtonIcon>
                </Button>
              </ButtonWhiteBigHover>
            </ButtonWhiteBigHoverParent>
          ) : (
            <ButtonWhiteBigHoverParent>
              <ButtonWhiteBigHover>
                <Button onClick={handleJadwal}>
                  Undangan Rapat
                  <ButtonIcon>
                    <FaArrowUpRightFromSquare />
                  </ButtonIcon>
                </Button>
              </ButtonWhiteBigHover>
              <ButtonPrimaryBigHover>
                <Button>
                  Tugas Rapat
                  <ButtonIcon>
                    <FaArrowUpRightFromSquare />
                  </ButtonIcon>
                </Button>
              </ButtonPrimaryBigHover>
            </ButtonWhiteBigHoverParent>
          )}
        </Container>
      </HomeRoot>
    </>
  );
};

export default Home;
