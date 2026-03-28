import dayjs from "dayjs";
//import formatDateTime from "../../Functions/formatDateTime";
import PaginationTable from "../../UI/PaginationTable/PaginationTable";
import { useCallback, useMemo, useState } from "react";
import AddVoterModal from "../../UI/Modals/AddVoterModal";
import EditVoterModal from "../../UI/Modals/EditVoterModal";
import Toast from "../../UI/Notification/Toast";
import Footer from "../../Footer/Footer";
import Button from "../../UI/Button/Button";
import PrintIcon from "../../UI/Icons/PrintIcon";
import { printVoters } from "../../Functions/printVoters";
import useDeleteHook from "../../CustomHooks/useDeleteHook";
import useFetch from "../../CustomHooks/useFetch";
import app_api_url from "../../../app_api_url";
import TableSkeleton from "../../UI/Skeleton/TableSkeleton";
import formatDateTime from "../../Functions/formatDateTime";

// const allVoters = [
//   {
//     id: 2026001,
//     image: "",
//     name: "Adu-Boahen Charles",
//     dob: "2006-10-02",
//   },

//   {
//     id: 2026002,
//     image: "",
//     name: "Martha Kwayisi",
//     dob: "2010-05-07",
//   },

//   {
//     id: 2026003,
//     image: "",
//     name: "Emmanuella 09",
//     dob: "2010-05-07",
//   },

//   {
//     id: 2026004,
//     image: "",
//     name: "Cecilia Boateng",
//     dob: "2010-05-07",
//   },
// ];

const RegisterVotersContent = () => {
  const [showAddVoterModal, setShowAddVoterModal] = useState(false);
  const [showEditVoterModal, setShowEditVoterModal] = useState(false);
  const [submitEditData, setSubmitEditData] = useState({});
  //const [voters, setVoters] = useState([]);

  const { deleteData } = useDeleteHook();

  const { data, setRefetch, loading } = useFetch(`${app_api_url}/getAllVoters`); //Getting all users details

  //Getting all users details
  const allVoters = useMemo(() => (data !== null ? data : []), [data]);

  // Handler to open the Add Voter Modal
  const onAddVoterHandler = useCallback(() => {
    setShowAddVoterModal(true);
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

  //Function to call toast modal
  const ToastHandler = useCallback((type, message) => {
    Toast(type, message);
  }, []);

  //Function to refresh table
  const setRefetchHandler = useCallback(() => {
    setRefetch((prev) => !prev);
  }, [setRefetch]);

  //////////////////////////////////////////
  //Handler to delete voters
  //////////////////////////////////////////
  const onDeleteHandler = useCallback(
    (id) => {
      if (window.confirm("Are you sure you want to delete?")) {
        // setVoters((prev) => {
        //   return Array.isArray(prev)
        //     ? prev.filter((voter) => voter.id !== id)
        //     : prev;
        // });

        deleteData(`deleteVoter/${id}`, ToastHandler, setRefetchHandler);
      }
    },
    [deleteData, ToastHandler, setRefetchHandler],
  );

  /////////////////////////////////////////////////////////
  //* Handler to print all registered voters */
  /////////////////////////////////////////////////////
  const onPrintAllVotersHandler = useCallback(() => {
    if (Array.isArray(allVoters) && allVoters.length > 0) {
      // Format voters data for printing
      const formattedVoters = allVoters.map((voter) => ({
        id: voter.voterId,
        name: voter.fullName,
        dob: dayjs(voter.DOB).format("DD MMM, YYYY"),
        dateCreated: dayjs(voter.dateCreated).format("DD MMM, YYYY"),
      }));
      printVoters(formattedVoters, "Registered Voters Report");
    } else {
      Toast("info", "No voters to print");
    }
  }, [allVoters]);

  /// Define columns for the pagination table
  const columns = [
    { field: "sn", headerName: "S/N" },
    { field: "id", headerName: "ID" },
    { field: "image", headerName: "Photo", type: "image" },
    { field: "name", headerName: "Full Name" },
    { field: "dob", headerName: "DOB", type: "dob" },
    {
      field: "dateCreated",
      headerName: "Registration Date",
      type: "dateCreated",
    },
  ];

  // Format rows for the pagination table
  const rows = allVoters.map((voter, index) => ({
    sn: index + 1,
    id: voter.voterId,
    image: voter.photo,
    name: voter.fullName,
    dob: dayjs(voter.DOB).format("DD MMM, YYYY"),
    dateCreated: formatDateTime(voter.dateCreated),
  }));

  return (
    <>
      {showAddVoterModal && (
        <AddVoterModal
          onAddVoter={(voterData) =>
            onAddVoterHandler(showAddVoterModal, voterData)
          }
          toastModal={ToastHandler}
          refreshTable={setRefetchHandler}
          onCloseModal={closeShowAddVoterModalHandler}
        />
      )}

      {showEditVoterModal && (
        <EditVoterModal
          // onAddCandidate={(voterData) =>
          //   onEditVoterHandler(showEditVoterModal, voterData)
          // }
          toastModal={ToastHandler}
          refreshTable={setRefetchHandler}
          submitEditData={submitEditData}
          onCloseModal={closeShowEditVoterModalHandler}
        />
      )}

      <div className="table_wrapper">
        {loading ? (
          <TableSkeleton />
        ) : (
          <PaginationTable
            // key={id}
            columns={columns}
            rows={rows}
            onEdit={onEditVoterHandler}
            onDelete={onDeleteHandler}
            onAdd={onAddVoterHandler}
            customHeaderButtons={
              <Button onClick={onPrintAllVotersHandler}>
                <PrintIcon size="20" /> Print
              </Button>
            }
          />
        )}
      </div>

      <div>
        <Footer />
      </div>
    </>
  );
};
export default RegisterVotersContent;
