import dayjs from "dayjs";
//import formatDateTime from "../../Functions/formatDateTime";
import PaginationTable from "../../UI/PaginationTable/PaginationTable";
import { useCallback, useState } from "react";
import AddVoterModal from "../../UI/Modals/AddVoterModal";
import EditVoterModal from "../../UI/Modals/EditVoterModal";
import Toast from "../../UI/Notification/Toast";
import Footer from "../../Footer/Footer";
import Button from "../../UI/Button/Button";
import PrintIcon from "../../UI/Icons/PrintIcon";
import { printVoters } from "../../Functions/printVoters";

const allVoters = [
  {
    id: 2026001,
    image: "",
    name: "Adu-Boahen Charles",
    dob: "2006-10-02",
  },

  {
    id: 2026002,
    image: "",
    name: "Martha Kwayisi",
    dob: "2010-05-07",
  },

  {
    id: 2026003,
    image: "",
    name: "Emmanuella 09",
    dob: "2010-05-07",
  },

  {
    id: 2026004,
    image: "",
    name: "Cecilia Boateng",
    dob: "2010-05-07",
  },
];

const RegisterVotersContent = () => {
  const [showAddVoterModal, setShowAddVoterModal] = useState(false);
  const [showEditVoterModal, setShowEditVoterModal] = useState(false);
  const [submitEditData, setSubmitEditData] = useState({});
  const [voters, setVoters] = useState(allVoters);

  // Handler to open the Add Voter Modal
  const onAddVoterHandler = useCallback(() => {
    setShowAddVoterModal(true);
  }, []);

  const ToastHandler = useCallback((type, message) => {
    Toast(type, message);
  }, []);

  const onEditVoterHandler = useCallback((id, image, name, dob) => {
    setShowEditVoterModal(true);

    setSubmitEditData({
      id: id,
      image: image,
      name: name,
      dob: dob,
    });
  }, []);

  const closeShowEditVoterModalHandler = useCallback(() => {
    setShowEditVoterModal(false);
  }, []);

  const closeShowAddVoterModalHandler = useCallback(() => {
    setShowAddVoterModal(false);
  }, []);

  /////////////////////////////////////////////////////////
  //* Handler to print all registered voters */
  /////////////////////////////////////////////////////
  const onPrintAllVotersHandler = useCallback(() => {
    if (Array.isArray(voters) && voters.length > 0) {
      // Format voters data for printing
      const formattedVoters = voters.map((voter) => ({
        id: voter.id,
        name: voter.name,
        dob: dayjs(voter.dob).format("DD MMM, YYYY"),
      }));
      printVoters(formattedVoters, "Registered Voters Report");
    } else {
      Toast("info", "No voters to print");
    }
  }, [voters]);

  /// Define columns for the pagination table
  const columns = [
    { field: "sn", headerName: "S/N" },
    { field: "id", headerName: "ID" },
    { field: "image", headerName: "Photo", type: "image" },
    { field: "name", headerName: "Full Name" },
    { field: "dob", headerName: "DOB", type: "dob" },
  ];

  // Format rows for the pagination table
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
          customHeaderButtons={
            <Button onClick={onPrintAllVotersHandler}>
              <PrintIcon size="20" /> Print
            </Button>
          }
        />
      </div>

      <div>
        <Footer />
      </div>
    </>
  );
};
export default RegisterVotersContent;
