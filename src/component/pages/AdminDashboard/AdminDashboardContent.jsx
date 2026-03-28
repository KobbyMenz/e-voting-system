import { Fragment, useCallback, useState } from "react";
import { Box } from "@mui/material";
import PropTypes from "prop-types";
import classes from "../AdminDashboard/AdminDashboardContent.module.css";
import Card from "../../UI/Card/Card";
import Button from "../../UI/Button/Button";
import AddIcon from "../../UI/Icons/AddIcon";
import PrintIcon from "../../UI/Icons/PrintIcon";
import Modal from "../../UI/Modals/Modal";
import AddElectionModal from "../../UI/Modals/AddElectionModal";
import AddCandidateModal from "../../UI/Modals/AddCandidateModal";
import AccordionExpandDefault from "../../UI/Accordion/Accordion";
import DigitalClock from "../../UI/Clock/DigitalClock";
import Footer from "../../Footer/Footer";
import Toast from "../../UI/Notification/Toast";
//import formatDateTime from "../../Functions/formatDateTime";
import EditElectionModal from "../../UI/Modals/EditElectionModal";
//import dayjs from "dayjs";
import Loader from "../../UI/Loader/Loader";
import SearchBar from "../../UI/SearchBar/SeachBar";
import EditCandidateModal from "../../UI/Modals/EditCandidateModal";
import useDeleteHook from "../../CustomHooks/useDeleteHook";
import { printElectionResults } from "../../Functions/printElectionResults";
import { authLocalStorage } from "../../Utils/authLocalStorage";
// import axios from "axios";
// import app_api_url from "../../../app_api_url";
// import useFetch from "../../Hooks/useFetch";

// Default candidates list
const DEFAULT_CANDIDATES = [
  // {
  //   id: "2024001",
  //   name: "Augustine Mensah",
  // },
  // {
  //   id: "2024002",
  //   name: "Deborah Quarshie",
  // },
];

// Unique ID generator function
const generateUniqueId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Table columns definition
const columns = [
  { field: "sn", headerName: "S/N" },
  { field: "id", headerName: "ID" },
  { field: "image", headerName: "Photo", type: "image" },
  { field: "name", headerName: "Candidate Name", type: "candidateName" },
  { field: "position", headerName: "Position", type: "position" },
  { field: "votes", headerName: "No. of Votes", type: "votes" },
];

// Function to create a new election instance with candidates
const createElectionInstance = (
  title,
  description,
  dateCreated,
  status,
  startDate,
  endDate,
  candidates = DEFAULT_CANDIDATES,
) => ({
  id: generateUniqueId(),
  title: title,
  description: description,
  dateCreated: dateCreated,
  status: status,
  startDate: startDate,
  endDate: endDate,

  candidates: candidates.map((candidate, index) => ({
    sn: index + 1,
    id: candidate.id,
    image: candidate.photo ? candidate.photo : "",
    name: candidate.name,
    position: candidate.position ? candidate.position : "N/A",
    votes: candidate.votes ? candidate.votes : 0,
  })),
});

const election = [
  createElectionInstance(
    "Boys Prefect",
    "Namong Boys Prefect Election",
    "2026-01-02T07:00",
    "Closed",
    "2026-01-23T07:00",
    "2026-01-27T19:00",
  ),
  createElectionInstance(
    "Girls Prefect",
    "Namong Girls Prefect Election",
    "2026-01-03T07:10",
    "Closed",
    "2026-02-04T08:00",
    "2026-02-05T20:00",
  ),
];

const AdminDashboardContent = () => {
  const [showAddElectionModal, setShowAddElectionModal] = useState(false);
  const [showEditElectionModal, setShowEditElectionModal] = useState(false);
  const [addElection, setAddElection] = useState(election);
  const [expandedId, setExpandedId] = useState(null);
  //const [addCandidate, setAddCandidate] = useState(DEFAULT_CANDIDATES);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [submitCandidateData, setSubmitCandidateData] = useState({});
  const [showEditCandidateModal, setShowEditCandidateModal] = useState(false);
  const [submitElectionData, setSubmitElectionData] = useState({});
  //const [loading, setLoading] = useState(true);

  const { deleteData } = useDeleteHook();
  const userName = authLocalStorage().fullName.split(" ")[0];

  //  const { data, loading, setRefetch } = useFetch(
  //   `${app_api_url}/getAllElections`,
  // );
  // const allElections = data !== null ? data : [];

  //Refetch data handler
  // const refetchHandler = useCallback(() => {
  //   setRefetch((prev) => !prev);
  // }, [setRefetch]);

  const closeShowModalHandler = useCallback(() => {
    setShowModal((prev) => !prev);
  }, []);

  const onShowAddElectionModalHandler = useCallback(() => {
    setShowAddElectionModal(true);
  }, []);

  const onEditCandidateHandler = useCallback(
    (id, image, name, dob, position) => {
      setShowEditCandidateModal(true);

      setSubmitCandidateData({
        id: id,
        name: name,
        image: image,
        dob: dob,
        position: position,
      });
    },
    [],
  );

  const closeShowAddElectionModalHandler = useCallback(() => {
    setShowAddElectionModal(false);
  }, []);

  const closeShowEditCandidateModalHandler = useCallback(() => {
    setShowEditCandidateModal(false);
  }, []);

  const closeShowEditElectionModalHandler = useCallback(() => {
    setShowEditElectionModal(false);
  }, []);

  //Function to handle accordion expand/collapse and ensure only one is expanded at a time
  const onAccordionExpandChange = useCallback((id, isExpanded) => {
    setExpandedId(isExpanded ? id : null);
  }, []);

  const ToastHandler = useCallback((type, message) => {
    Toast(type, message);
  }, []);

  const onShowAddCandidateModalHandler = useCallback((electionId) => {
    setShowAddCandidateModal(electionId);
  }, []);

  const closeShowAddCandidateModalHandler = useCallback(() => {
    setShowAddCandidateModal(false);
  }, []);

  // const onChangeHandler = (e) => {
  //   ;
  // };

  // Filter added election rows based on search
  const filteredElectionRows = addElection.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase()),
    ),
  );

  /////////////////////////////////////////////////////////
  //* Handler to add a candidate to a specific election*/
  /////////////////////////////////////////////////////
  const onAddCandidateHandler = (electionId, candidateData) => {
    // Validate candidate data
    if (
      typeof candidateData === "object" &&
      candidateData !== null &&
      candidateData.id &&
      candidateData.image &&
      candidateData.name &&
      candidateData.position
    ) {
      setAddElection((prev) => {
        return Array.isArray(prev)
          ? prev.map((election) => {
              if (election.id === electionId) {
                return {
                  ...election,
                  candidates: [
                    ...election.candidates,
                    {
                      sn: election.candidates.length + 1,
                      id: candidateData.id,
                      image: candidateData.image,
                      name: candidateData.name,
                      position: candidateData.position,
                      votes: 0,
                    },
                  ],
                };
              }
              return election;
            })
          : prev;
      });
    }
  };

  ///////////////////////////////////////////////////////////////////
  //* Handler to add a new election */
  /////////////////////////////////////////////////////
  const onAddElectionHandler = (electionData) => {
    // Validate the election data
    if (
      typeof electionData === "object" &&
      electionData !== null &&
      electionData.title &&
      electionData.description &&
      electionData.dateCreated &&
      electionData.status &&
      electionData.startDate &&
      electionData.endDate
    ) {
      // Create a new election instance with its own candidates
      const newElection = createElectionInstance(
        electionData.title,
        electionData.description,
        electionData.dateCreated,
        electionData.status,
        electionData.startDate,
        electionData.endDate,
        electionData.candidates || DEFAULT_CANDIDATES,
      );

      setAddElection((prev) => {
        // Ensure prev is an array before spreading
        return Array.isArray(prev) ? [...prev, newElection] : [newElection];
      });
    }
  };

  //////////////////////////////////////////////
  //Edit Election
  /////////////////////////////////////////////
  const onShowEditElectionHandler = useCallback(
    (
      electionId,
      title,
      description,
      // status,
      dateCreated,
      startDate,
      endDate,
    ) => {
      setShowEditElectionModal(true);

      setSubmitElectionData({
        electionId: electionId,
        title: title,
        dateCreated: dateCreated,
        // status: status,
        description: description,
        startDate: startDate,
        endDate: endDate,
      });
      // addElection.filter((item) => {
      //   const electionData = item.electionId === electionId;

      //   //console.log("electionData: ", electionData);
      //   return electionData;
      // });
    },
    [],
  );

  /////////////////////////////////////////////////////////
  //* Handler to change election status */
  /////////////////////////////////////////////////////
  // const onClickElectionStatus = useCallback((electionId, status) => {
  //   if (
  //     window.confirm(
  //       `Are you sure you want to ${status === "Upcoming" ? "start" : status === "Active" ? "close" : "start"} election?`,
  //     )
  //   ) {
  //     setAddElection((prev) => {
  //       return Array.isArray(prev)
  //         ? prev.map((election) => {
  //             if (election.id === electionId) {
  //               const newStatus =
  //                 election.status === "Active" ? "Closed" : "Active";
  //               Toast(
  //                 "success",
  //                 `${election.title} election ${
  //                   newStatus === "Active" ? "started" : "closed"
  //                 } successfully.`,
  //               );
  //               return {
  //                 ...election,
  //                 status: newStatus,
  //               };
  //             }
  //             return election;
  //           })
  //         : prev;
  //     });
  //   }
  // }, []);

  /////////////////////////////////////////
  //delete election handler
  ////////////////////////////////////////
  const onDeleteElectionHandler = useCallback(
    (electionId) => {
      if (window.confirm("Are you sure you want to delete this election?")) {
        setAddElection((prev) => {
          return Array.isArray(prev)
            ? prev.filter((election) => election.id !== electionId)
            : prev;
        });
        Toast("success", "Election deleted successfully.");

        //Hook to delete election
        deleteData(`deleteElection/${electionId}`, ToastHandler);
      }
    },
    [deleteData, ToastHandler],
  );

  /////////////////////////////////////////
  //delete candidate handler
  ////////////////////////////////////////
  const onDeleteCandidateHandler = useCallback(
    (candidateId) => {
      if (window.confirm("Are you sure you want to delete this candidate?")) {
        setAddElection((prev) => {
          return Array.isArray(prev)
            ? prev.map((election) => {
                return {
                  ...election,
                  candidates: election.candidates.filter(
                    (candidate) => candidate.id !== candidateId,
                  ),
                };
              })
            : prev;
        });
        Toast("success", "Candidate deleted successfully.");

        //Hook to delete candidate
        deleteData(`deleteCandidate/${candidateId}`, ToastHandler);
      }
    },
    [deleteData, ToastHandler],
  );

  /////////////////////////////////////////////////////////
  //* Handler to print all election results */
  /////////////////////////////////////////////////////
  const onPrintAllResultsHandler = useCallback(() => {
    if (Array.isArray(addElection) && addElection.length > 0) {
      printElectionResults(addElection, "All Elections Report");
    } else {
      Toast("info", "No elections to print");
    }
  }, [addElection]);

  const totalCandidates = addElection
    .map((item) => item.candidates.length)
    .slice(0, -1)
    .reduce((a, b) => a + b, 0);

  return (
    <Fragment>
      {/* {loading && <Loader />} */}

      {showModal && <Modal onCloseModal={closeShowModalHandler} />}

      {showAddElectionModal && (
        <AddElectionModal
          onAddElection={onAddElectionHandler}
          toastModal={ToastHandler}
          //setRefetch={refetchHandler}
          onCloseModal={closeShowAddElectionModalHandler}
        />
      )}

      {showEditElectionModal && (
        <EditElectionModal
          submitElectionData={submitElectionData}
          // onEditElection={onEditElectionHandler}
          toastModal={ToastHandler}
          //setRefetch={refetchHandler}
          onCloseModal={closeShowEditElectionModalHandler}
        />
      )}

      {showAddCandidateModal && (
        <AddCandidateModal
          onAddCandidate={(candidateData) =>
            onAddCandidateHandler(showAddCandidateModal, candidateData)
          }
          toastModal={ToastHandler}
          onCloseModal={closeShowAddCandidateModalHandler}
        />
      )}

      {showEditCandidateModal && (
        <EditCandidateModal
          onSubmitCandidateData={submitCandidateData}
          toastModal={ToastHandler}
          onCloseModal={closeShowEditCandidateModalHandler}
        />
      )}

      <div className={classes.content__container}>
        <Card className={"card__wrapper"}>
          {/* {loading ? (
            <WelcomeMessageSkeleton />
          ) :  */}

          <div className={classes.message_container}>
            <div className={classes.welcome_text}>
              <h2 className={classes.welcome_message_header}>
                {`Hi ${userName}, welcome back to admin dashboard`}
              </h2>

              <p
                className={classes.welcome_message}
              >{`Manage elections, candidate, and view real-time results.`}</p>
            </div>

            <DigitalClock />
          </div>
        </Card>

        <div className={` ${classes.system_overview_card}`}>
          {
            <section>
              {/* {
                <p
                  className={classes.heading}
                >{`Hi ${userName}, Welcome to Admin Dashboard Area`}</p>
              } */}
              {/* <h2 className={classes.sub__title}>System Overview</h2> */}

              <div className={classes.flexbox_container}>
                <div className={classes.card__box__container}>
                  <Card className={classes.card__box}>
                    <div className={classes.description__container}>
                      <div className={classes.description}>
                        <p>{`Registered Voters:`}</p>
                        <p className={`${classes.amount}`}>{0}</p>
                      </div>
                    </div>

                    <div className={`${classes.icon} ${classes.icon__violet}`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                      >
                        <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
                      </svg>
                    </div>
                  </Card>

                  <Card className={classes.card__box}>
                    <div className={classes.description__container}>
                      <div className={classes.description}>
                        <p>Number of Elections:</p>
                        <p className={classes.amount2}>{addElection.length}</p>
                      </div>
                    </div>

                    <div className={`${classes.icon} ${classes.icon__blue}`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </Card>

                  <Card className={classes.card__box}>
                    <div className={classes.description__container}>
                      <div className={classes.description}>
                        <p>Total Candidates:</p>
                        <p className={classes.amount2}>{totalCandidates}</p>
                      </div>
                    </div>

                    <div className={`${classes.icon} ${classes.icon__yellow}`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
                          clipRule="evenodd"
                        />
                        <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
                      </svg>
                    </div>
                  </Card>

                  <Card className={classes.card__box}>
                    <div className={classes.description__container}>
                      <div className={classes.description}>
                        <p>Total Votes Cast:</p>

                        <p className={` ${classes.amount2}`}>{0}</p>
                      </div>
                    </div>

                    <div
                      className={`${classes.icon} ${classes.icon__lightblue}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                      >
                        <g
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        >
                          <path d="m9 12l2 2l4-4"></path>
                          <path d="M4 20V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14m2 0H2"></path>
                        </g>
                      </svg>
                    </div>
                  </Card>
                </div>
              </div>
            </section>
          }
        </div>

        {/*===top 10 products table===*/}
        <section>
          <Card className="card__wrapper">
            <div className={classes.message_container}>
              <div className={classes.welcome_text}>
                <h1>Election Management</h1>
                <p>
                  Control active status, manage candidates, and view results for
                  all elections.
                </p>
              </div>

              <Box
                display="flex"
                gap="1rem"
                flexWrap="wrap-reverse"
                alignItems="center"
              >
                <div style={{ flexGrow: "1" }}>
                  <SearchBar
                    placeholder="Search for election..."
                    type="search"
                    id="searchElection"
                    name="searchElection"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <Button onClick={onPrintAllResultsHandler}>
                  {" "}
                  <PrintIcon size="20" /> Print Results
                </Button>

                <Button onClick={onShowAddElectionModalHandler}>
                  {" "}
                  <AddIcon /> New Election
                </Button>
              </Box>
            </div>

            <Box sx={{ padding: "1rem 0" }}>
              {Array.isArray(filteredElectionRows) &&
              filteredElectionRows.length > 0 ? (
                <>
                  {filteredElectionRows.map((item) => (
                    <AccordionExpandDefault
                      key={item.id}
                      id={item.id}
                      electionTitle={item.title}
                      description={item.description}
                      dateCreated={item.dateCreated}
                      startDate={item.startDate}
                      endDate={item.endDate}
                      status={item.status}
                      columns={columns}
                      rows={item.candidates}
                      onAdd={() => onShowAddCandidateModalHandler(item.id)}
                      onEdit={onEditCandidateHandler}
                      // onChangeStatus={() =>
                      //   onClickElectionStatus(item.id, item.status)
                      // }
                      onDeleteCandidate={onDeleteCandidateHandler}
                      onDeleteElection={onDeleteElectionHandler}
                      onEditElection={onShowEditElectionHandler}
                      expanded={expandedId === item.id}
                      onExpandChange={onAccordionExpandChange}
                    />
                  ))}
                  {/* <ul>
                  {addElection.map((item, index) => (
                    <li key={index}>
                      {typeof item === "object" && item.title
                        ? item.title
                        : "Unnamed Election"}
                    </li>
                  ))}
                </ul> */}
                </>
              ) : (
                <p
                  style={{
                    textAlign: "center",
                    borderTop: "0.2rem solid #ccc",
                    padding: "2rem 0 1rem 0",
                  }}
                >
                  No election added yet
                </p>
              )}
            </Box>
          </Card>
        </section>

        {/* ======sales report table======= */}
        {/* <div className="sales_table">
          {loading ? (
            <TableSkeleton />
          ) : (
            <SalesHistoryPT
              columns={columns}
              rows={rows}
              onChangeDate={onChangeDateHandler}
              amount={currencyFormatter(
                +filteredItemAmount,
                currency
              ).toString()}
              onChange={onChangeHandler}
            />
          )}
        </div> */}

        {/*======= usage log ========*/}

        <div style={{ marginTop: "-1rem" }}>
          <Footer />
        </div>
      </div>
    </Fragment>
  );
};
AdminDashboardContent.propTypes = {
  closeLoader: PropTypes.func,
};
export default AdminDashboardContent;
