import { Outlet } from "react-router-dom";
import styled from "styled-components";
import NavBar from "./Navbar";

const Parent = styled.div`
  align-self: stretch;
  flex: 1;
  background-color: #f8f8f8;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 16px;
`;
const Root = styled.div`
  padding-top: 70px;
  width: 100%;
  height: calc(
    100vh - 70px
  ); /* Adjust this based on your navbar/logo-header height */
  position: relative;
  background-color: #f8f8f8;
  font-size: 24px;
`;

const Layout = () => {
  return (
    <>
      <NavBar />
      <Root>
        <Parent>
          <Outlet />
        </Parent>
      </Root>
    </>
  );
};

export default Layout;
