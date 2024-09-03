import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { FiEdit } from "react-icons/fi";

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
  position: relative; /* For positioning the tooltip */
`;
const Tooltip = styled.div`
  position: absolute;
  background-color: #333;
  color: #fff;
  padding: 5px;
  border-radius: 4px;
  transform: translateY(5px);
  white-space: nowrap;
  font-size: 12px;
  z-index: 10;
  visibility: ${(props) => (props.show ? "visible" : "hidden")};
`;
const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;
const EditIcon = styled.div`
  color: #ffc107;
  cursor: pointer;
  display: flex;
  align-items: left;
  justify-content: left;
`;

const UserList = () => {
  const [role, setRole] = useState("");
  const [users, setUsers] = useState([]);
  const [hoveredUserId, setHoveredUserId] = useState(null); // Track hovered user
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    console.log("Stored role:", storedRole); // Debugging role
    setRole(storedRole);

    const fetchUsers = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("No access token found");
        }

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/users`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
			withCredentials: true,
          }
        );

        console.log("Fetched users:", response.data); // Debugging response data

        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleUpdateUser = (id) => {
    const type = role === "superadmin" ? "operator" : "karyawan"; //jika rolenya superadmin maka tipe yang dikelola adalah operator
    navigate(`/update-${type}/${id}`);
    console.log("Edit user:", id, type);
  };

  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            {role === "superadmin" && <TableHeaderCell>Unit</TableHeaderCell>}
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Aksi</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <tbody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              {role === "superadmin" && (
                <TableCell>{user.unit?.nameUnit}</TableCell>
              )}
              <TableCell
                onMouseEnter={() => setHoveredUserId(user.id)}
                onMouseLeave={() => setHoveredUserId(null)}
              >
                {user.status === "active" ? "Aktif" : "Tidak Aktif"}
                {user.status === "inactive" && (
                  <Tooltip show={hoveredUserId === user.id}>
                    {user.alasanInactive || "No reason provided"}
                  </Tooltip>
                )}
              </TableCell>
              <TableCell>
                <EditIcon onClick={() => handleUpdateUser(user.id)}>
                  <FiEdit />
                </EditIcon>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default UserList;
