import dayjs from "dayjs";
//import formatDateTime from "../../Functions/formatDateTime";
import PaginationTable from "../../UI/PaginationTable/PaginationTable";
import { useCallback, useState } from "react";
import AddVoterModal from "../../UI/Modals/AddVoterModal";
import EditVoterModal from "../../UI/Modals/EditVoterModal";
import Toast from "../../UI/Notification/Toast";
import Footer from "../../Footer/Footer";

const allVoters = [
  {
    id: 2025001,
    image: "",
    name: "Adu-Boahen Charles",
    dob: "2006-10-02",
  },

  {
    id: 2025002,
    image: "",
    name: "Emmanuella 09",
    dob: "2010-05-07",
  },
];

const RegisterVotersContent = () => {
  const [showAddVoterModal, setShowAddVoterModal] = useState(false);
  const [showEditVoterModal, setShowEditVoterModal] = useState(false);
  const [submitEditData, setSubmitEditData] = useState({});
  //columns for pagination table (ManageUserPT)

  const onAddVoterHandler = () => {
    setShowAddVoterModal(true);
  };

  const ToastHandler = useCallback((type, message) => {
    Toast(type, message);
  }, []);

  const onEditVoterHandler = (id, image, name, dob) => {
    setShowEditVoterModal(true);

    setSubmitEditData({
      id: id,
      image: image,
      name: name,
      dob: dob,
    });
  };

  const closeShowEditVoterModalHandler = () => {
    setShowEditVoterModal(false);
  };

  const closeShowAddVoterModalHandler = () => {
    setShowAddVoterModal(false);
  };

  const columns = [
    { field: "sn", headerName: "S/N" },
    { field: "id", headerName: "ID" },
    { field: "image", headerName: "Photo", type: "image" },
    { field: "name", headerName: "Full Name" },
    { field: "dob", headerName: "DOB", type: "dob" },
  ];

  const rows = allVoters.map((voter, index) => ({
    sn: index + 1,
    id: voter.id,
    image: voter.image,
    name: voter.name,
    dob: dayjs(voter.dob).format("DD MMM, YYYY"),
  }));

  return (
    <>
      {showAddVoterModal && (
        <AddVoterModal
          onAddVoter={(voterData) =>
            onAddVoterHandler(showAddVoterModal, voterData)
          }
          toastModal={ToastHandler}
          onCloseModal={closeShowAddVoterModalHandler}
        />
      )}

      {showEditVoterModal && (
        <EditVoterModal
          // onAddCandidate={(voterData) =>
          //   onEditVoterHandler(showEditVoterModal, voterData)
          // }
          toastModal={ToastHandler}
          submitEditData={submitEditData}
          onCloseModal={closeShowEditVoterModalHandler}
        />
      )}

      <div className="table_wrapper">
        <PaginationTable
          // key={id}
          columns={columns}
          rows={rows}
          onEdit={onEditVoterHandler}
          // onDelete={onDelete}
          onAdd={onAddVoterHandler}
        />
      </div>

      <div>
        <Footer />
      </div>
    </>
  );
};
export default RegisterVotersContent;
