import { Fragment, useCallback, useMemo, useState } from "react";
//import classes from "../dashboard/DashboardContent.module.css";
//import styles from "../AdminStaff/AdminStaffContent.module.css";
//import defaultUserPhoto from "../../../assets/images/profilePicture.png";
import Card from "../../UI/Card/Card";
//import Button from "../../UI/Button";
import PropTypes from "prop-types";
import Loader from "../../UI/Loader/Loader";
import Modal from "../../UI/Modals/Modal";
import axios from "axios";
import Footer from "../../Footer/Footer";
//import ToolTip from "../../UI/ToolTip/ToolTip";
//import ErrorIcon from "../../UI/ErrorIcon";
// import OkayIcon from "../../UI/OkayIcon";
// import InfoIcon from "../../UI/InfoIcon";
//import ImageBox from "../../UI/ImageBox/ImageBox";
import Toast from "../../UI/Notification/Toast";
//import PaginationTableWithImage from "../../UI/PaginationTable/PaginationTableWithImage";
import ManageUserPT from "../../UI/PaginationTable/ManageUserPT";
import AddUserModal from "../../UI/Modals/AddUserModal";
import UpdateUserModal from "../../UI/Modals/UpdateUserModal";
import formatDateTime from "../../Functions/formatDateTime";
//import useFetch from "../../CustomHooks/useFetchHook";
import TableSkeleton from "../../UI/Skeleton/TableSkeleton";
//import NavTabs from "../../UI/Tab/NavTabs";
import app_api_url from "../../../app_api_url";
import classes from "../ManageUsers/ManageUsersContent.module.css";
import useDeleteHook from "../../CustomHooks/useDeleteHook";
import useFetch from "../../CustomHooks/useFetchHook";

//Getting all users details
// const allUsers = [
//   {
//     id: 2025001,
//     image: "",
//     name: "Augustine Mensah",
//     userName: "KobbyMenz",
//     email: "kmz@email",
//     contact: "0546163240",
//     // role: "Admin",
//     userStatus: "Enabled",
//     dateCreated: formatDateTime("2026-02-02T02:00"),
//     lastLogin: formatDateTime("2026-02-02T02:00"),
//   },

//   {
//     id: 2025002,
//     image: "",
//     name: "Enoch Boakye",
//     userName: "KobbyMenz",
//     email: "enoch@email",
//     contact: "0546163240",
//     // role: "Admin",
//     userStatus: "Disabled",
//     dateCreated: formatDateTime("2026-02-02T02:00"),
//     lastLogin: formatDateTime("2026-02-02T02:00"),
//   },

//   {
//     id: 2025003,
//     image: "",
//     name: "Emmanuel Adu Darkwah",
//     userName: "emmanueladu@gmail.com",
//     email: "enoch@email",
//     contact: "0546163240",
//     // role: "Admin",
//     userStatus: "Enabled",
//     dateCreated: formatDateTime("2026-02-02T02:00"),
//     lastLogin: formatDateTime("2026-02-02T02:00"),
//   },

//   {
//     id: 2025004,
//     image: "",
//     name: "Alex Baah",
//     userName: "KobbyMenz",
//     email: "Alexakwasi@gmail.com",
//     contact: "0546163240",
//     // role: "Admin",
//     userStatus: "Disabled",
//     dateCreated: formatDateTime("2026-02-02T02:00"),
//     lastLogin: formatDateTime("2026-02-02T02:00"),
//   },
// ];

//import moment from "moment";

const ManageUsersContent = () => {
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateUserModal, setShowUpdateUserModal] = useState(false);
  const [submit, setSubmit] = useState("");
  const [users, setUsers] = useState([]);

  const { deleteData } = useDeleteHook();

  const { data, setRefetch } = useFetch(`${app_api_url}/getAllUsers`); //Getting all users details

  //Getting all users details
  const allUsers = useMemo(() => (data !== null ? data : []), [data]);

  console.log("All users: ", allUsers);

  // const { data, loading, setRefetch } = useFetch(`${app_api_url}/getAllUsers`); //Getting all users details

  //  useMemo(
  //   () =>
  //     data !== null
  //       ?
  //       : [],
  //   [data],
  // );

  const closeShowModalHandler = useCallback(() => {
    setShowModal(false);
  }, []);

  const closeShowAddModalHandler = useCallback(() => {
    setShowAddModal(false);
  }, []);

  const onShowAddModalHandler = useCallback(() => {
    setShowAddModal(true);
  }, []);

  const onShowUpdateUserModalHandler = useCallback(() => {
    setShowUpdateUserModal(true);
  }, []);

  const closeShowUpdateUserModalHandler = useCallback(() => {
    setShowUpdateUserModal(false);
  }, []);

  //Function to call toast modal
  const ToastHandler = useCallback((type, message) => {
    Toast(type, message);
  }, []);

  const setRefetchHandler = useCallback(() => {
    setRefetch((prev) => !prev);
  }, [setRefetch]);

  ////////////////////////////////////////////////
  //TOGGLE USER ACCOUNT STATUS
  ////////////////////////////////////////////////
  const toggleStatus = useCallback(
    async (userId, currentStatus, name) => {
      if (
        window.confirm(
          `Are you sure you want to ${
            currentStatus === "Enabled" ? "disable" : "enable"
          } account?`,
        )
      ) {
        try {
          let newStatus;
          //Getting user ID from local storage
          const storedUserId = JSON.parse(localStorage.getItem("user")).userId;

          /*Toggling user status.
        If userId matches the storedUserId, then do not change status
        */
          users.forEach((user) => {
            if (user.userId === userId) {
              if (userId === storedUserId) {
                newStatus = currentStatus;
                return;
              }
              newStatus = currentStatus === "Enabled" ? "Disabled" : "Enabled";
            }
          });

          const response = await axios.put(
            `${app_api_url}/changeUserStatus/${userId}`,
            { userStatus: newStatus },
          );
          setRefetchHandler(); //Refreshing table

          //Preventing the logged-in user from disabling their own account
          userId === storedUserId
            ? Toast(
                "warning",
                `This account cannot be disabled while logged in!`,
              )
            : Toast(
                "success",
                `${name}'s ${
                  response.data.message
                } ${newStatus.toLowerCase()} successfully`,
              );
        } catch (err) {
          Toast("error", `Error changing user status: ${err}`);
        }
      }
    },
    [users, setRefetchHandler],
  );

  ///////////////////////////////////////////
  // Delete user
  //////////////////////////////////////////////
  const deleteHandler = useCallback(
    (id) => {
      if (window.confirm("Are you sure you want to delete")) {
        setUsers((prev) => {
          return Array.isArray(prev)
            ? prev.filter((user) => user.id !== id)
            : prev;
        });

        deleteData(`deleteUser/${id}`, Toast);
      }
    },
    [deleteData],
  );

  ///////////////////////////////////////////////
  // Edit user details
  ///////////////////////////////////////////////
  const onEditHandler = useCallback(
    (id, image, name, userName, email, contact, role) => {
      //showing UpdateUserModal after clicking on edit button
      onShowUpdateUserModalHandler();

      //setting user details to updateUserModal
      setSubmit({
        id: id,
        image: image,
        name: name,
        userName: userName,
        email: email,
        contact: contact,
        role: role,
      });
    },
    [onShowUpdateUserModalHandler],
  );

  /////////////////////////////////////////

  //columns for pagination table (ManageUserPT)
  const columns = [
    { field: "sn", headerName: "S/N" },
    { field: "id", headerName: "ID" },
    { field: "image", headerName: "Photo", type: "image" },
    { field: "name", headerName: "Full Name" },
    { field: "userName", headerName: "UserName", type: "userName" },
    { field: "email", headerName: "Email" },
    { field: "contact", headerName: "Phone" },
    // { field: "role", headerName: "Role", type: "role" },
    { field: "userStatus", headerName: "Account Status", type: "status" },
    { field: "dateCreated", headerName: "Date Created" },
    { field: "lastLogin", headerName: "Last Login Date" },
  ];

  //rows for pagination table (ManageUserPT)
  const rows = allUsers.map((user, index) => {
    const loginDate = user.lastLogin;

    const dateCreated = user.dateCreated;

    return {
      sn: index + 1,
      id: user.id,
      image: user.photo ? user.photo : "",
      name: user.fullName,
      // userName: user.userName,
      email: user.email,
      contact: user.phone,
      // role: user.role,
      userStatus: user.status,
      dateCreated:
        dateCreated === null || dateCreated === ""
          ? ""
          : formatDateTime(dateCreated),

      lastLogin:
        loginDate === "" || loginDate === null
          ? "Not Available"
          : formatDateTime(loginDate),
    };
  });

  // const tabs = [
  //   { label: "System Settings", to: "/settings" },
  //   { label: "Manage Users", to: "/manageUsers" },
  // ];

  return (
    <Fragment>
      {/* {loading && <Loader />} */}

      {showModal && (
        <Modal
          title={showModal.title}
          icon={showModal.icon}
          message={showModal.message}
          onCloseModal={closeShowModalHandler}
        />
      )}

      {showAddModal && (
        <AddUserModal
          toastModal={ToastHandler}
          // setRefetch={setRefetchHandler}
          onCloseModal={closeShowAddModalHandler}
          allUsers={allUsers}
        />
      )}

      {showUpdateUserModal && (
        <UpdateUserModal
          toastModal={ToastHandler}
          userData={submit}
          //setRefetch={setRefetchHandler}
          onCloseModal={closeShowUpdateUserModalHandler}
        />
      )}

      {
        <div className={classes.content__container}>
          {/* <Card className={`${classes.card__wrapper} `}>
            <NavTabs tabs={tabs} />
          </Card> */}

          <div className="table_wrapper">
            {
              // loading ? (
              //   <TableSkeleton />
              // ) :
              <ManageUserPT
                columns={columns}
                rows={rows}
                onEdit={onEditHandler}
                onDelete={deleteHandler}
                toggleStatus={toggleStatus}
                onAdd={onShowAddModalHandler}
              />
            }
          </div>

          {/* Footer */}
          <Footer />
        </div>
      }
    </Fragment>
  );
};
ManageUsersContent.propTypes = {
  onClicked: PropTypes.func,
  show: PropTypes.bool,
  closeLoader: PropTypes.func,
  data: PropTypes.array,
  setRefetch: PropTypes.func,
  loading: PropTypes.bool,
};
export default ManageUsersContent;
