import { Fragment, useCallback, useState } from "react";
import { Box } from "@mui/material";
import PropTypes from "prop-types";

import classes from "../AdminDashboard/AdminDashboardContent.module.css";
import Card from "../../UI/Card/Card";
import Button from "../../UI/Button/Button";
import AddIcon from "../../UI/Icons/AddIcon";
import Modal from "../../UI/Modals/Modal";
import AddElectionModal from "../../UI/Modals/AddElectionModal";
import AddCandidateModal from "../../UI/Modals/AddCandidateModal";
import AccordionExpandDefault from "../../UI/Accordion/Accordion";
import DigitalClock from "../../UI/Clock/DigitalClock";
import Footer from "../../Footer/Footer";
import Toast from "../../UI/Notification/Toast";
//import formatDateTime from "../../Functions/formatDateTime";
import EditElectionModal from "../../UI/Modals/EditElectionModal";
import dayjs from "dayjs";
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
  { field: "name", headerName: "Candidate Name" },
  { field: "position", headerName: "Position", type: "position" },
];

// Function to create a new election instance with candidates
const createElectionInstance = (
  title,
  description,
  startDate,
  endDate,
  candidates = DEFAULT_CANDIDATES,
) => ({
  id: generateUniqueId(),
  title: title,
  dateCreated: dayjs().format("YYYY-MM-DDTHH:mm"),
  status: "Active",
  description: description,
  startDate: startDate,
  endDate: endDate,
  candidates: candidates.map((candidate, index) => ({
    sn: index + 1,
    id: candidate.id,
    image: candidate.photo ? candidate.photo : "",
    name: candidate.name,
    position: candidate.position ? candidate.position : "N/A",
  })),
});

const election = [
  createElectionInstance(
    "SRC Presidential",
    "Namong SRC Presidential Election",
    "2026-02-23T07:00",
    "2026-02-27T19:00",
  ),
  createElectionInstance(
    "Sanitation Prefect",
    "Namong SRC Sanitation Prefect Election",
    "2026-02-23T07:00",
    "2026-02-27T19:00",
  ),
];

const AdminDashboardContent = () => {
  const [showAddElectionModal, setShowAddElectionModal] = useState(false);
  const [showEditElectionModal, setShowEditElectionModal] = useState(false);
  const [addElection, setAddElection] = useState(election);
  //const [addCandidate, setAddCandidate] = useState(DEFAULT_CANDIDATES);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  const closeShowAddElectionModalHandler = useCallback(() => {
    setShowAddElectionModal(false);
  }, []);

  const closeShowEditElectionModalHandler = useCallback(() => {
    setShowEditElectionModal(false);
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
      candidateData.name
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
      electionData.startDate &&
      electionData.endDate
    ) {
      // Create a new election instance with its own candidates
      const newElection = createElectionInstance(
        electionData.title,
        electionData.description,
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
    (electionId) => {
      //console.log("electionId: ", electionId);
      setShowEditElectionModal(true);

      addElection.filter((item) => {
        const electionData = item.electionId === electionId;

        //console.log("electionData: ", electionData);
        return electionData;
      });
    },
    [addElection],
  );

  /////////////////////////////////////////////////////////
  //* Handler to change election status */
  /////////////////////////////////////////////////////
  const onClickElectionStatus = useCallback((electionId) => {
    setAddElection((prev) => {
      return Array.isArray(prev)
        ? prev.map((election) => {
            if (election.id === electionId) {
              const newStatus =
                election.status === "Active" ? "Closed" : "Active";
              Toast(
                "success",
                `${election.title} election ${
                  newStatus === "Active" ? "started" : "ended"
                } successfully.`,
              );
              return {
                ...election,
                status: newStatus,
              };
            }
            return election;
          })
        : prev;
    });
  }, []);

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

        // const deleteElection = async () => {
        //   try {
        //     const response = await axios.delete(
        //       `${app_api_url}/deleteElection/${electionId}`,
        //     );
        //     refetchHandler();

        //     ToastHandler("success", `${response.data.message}`);
        //   } catch (err) {
        //     ToastHandler("error", `Error deleting election: ${err}`);
        //   }
        // };
        // deleteElection();
      }
    },
    [
      // refetchHandler, ToastHandler
    ],
  );

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

      <div className={classes.content__container}>
        <Card className={classes.card__wrapper}>
          {/* {loading ? (
            <WelcomeMessageSkeleton />
          ) :  */}

          <div className={classes.message_container}>
            <div className={classes.welcome_text}>
              <h2 className={classes.welcome_message_header}>
                Admin Dashboard
                {/* {userName} (
                  {JSON.parse(localStorage.getItem("user")).loginType})! */}
              </h2>

              <p
                className={classes.welcome_message}
              >{`Manage elections, candidate, and view real-time results.`}</p>
            </div>

            <DigitalClock />
          </div>
        </Card>

        <div
          className={`${classes.card__wrapper} ${classes.system_overview_card}`}
        >
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
                        <p>Active Election:</p>
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

                  {/* <Card className={classes.card__box}>
                    <div className={classes.description__container}>
                      <div className={classes.description}>
                        <p>Customers:</p>

                        <p className={` ${classes.amount2}`}>{}</p>
                      </div>
                    </div>

                    <div className={`${classes.icon} ${classes.icon__orange}`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={64}
                        height={64}
                        viewBox="0 0 32 32"
                      >
                        <path
                          // fill="#ff8153ef"
                          fill="currentColor"
                          d="M12 8a4 4 0 1 1 8 0a4 4 0 0 1-8 0m-3.5 8c0-1.152.433-2.204 1.146-3H6a3 3 0 0 0-3 3v3.5a1 1 0 0 0 1 1h4.5zm15 0a4.48 4.48 0 0 0-1.146-3H26a3 3 0 0 1 3 3v3.5a1 1 0 0 1-1 1h-4.5zM3 23.5A1.5 1.5 0 0 1 4.5 22h23a1.5 1.5 0 0 1 1.5 1.5a4.5 4.5 0 0 1-4.5 4.5h-17A4.5 4.5 0 0 1 3 23.5m1-15a3.5 3.5 0 1 1 7 0a3.5 3.5 0 0 1-7 0m17 0a3.5 3.5 0 1 1 7 0a3.5 3.5 0 0 1-7 0M10 16a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v4.5H10z"
                        ></path>
                      </svg>
                    </div>
                  </Card> */}
                </div>
              </div>
            </section>
          }
        </div>

        {/*===top 10 products table===*/}
        <section>
          <Card className={classes.card__wrapper}>
            <div className={classes.message_container}>
              <div className={classes.welcome_text}>
                <h1>Election Management</h1>
                <p>
                  Control active status, manage candidates, and view results for
                  all elections.
                </p>
              </div>

              <Button onClick={onShowAddElectionModalHandler}>
                {" "}
                <AddIcon /> New Election
              </Button>
            </div>

            <Box sx={{ padding: "1rem 0" }}>
              {Array.isArray(addElection) && addElection.length > 0 ? (
                <>
                  {addElection.map((item) => (
                    <AccordionExpandDefault
                      key={item.id}
                      id={item.id}
                      electionTitle={item.title}
                      dateCreated={item.dateCreated}
                      startDate={item.startDate}
                      endDate={item.endDate}
                      status={item.status}
                      columns={columns}
                      rows={item.candidates}
                      onAdd={() => onShowAddCandidateModalHandler(item.id)}
                      onChangeStatus={() => onClickElectionStatus(item.id)}
                      onDeleteElection={onDeleteElectionHandler}
                      onEditElection={onShowEditElectionHandler}
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
                    padding: "1rem 0",
                  }}
                >
                  No election added
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

        <Card className={`${classes.card__wrapper} ${classes.footer_card}`}>
          <Footer />
        </Card>
      </div>
    </Fragment>
  );
};
AdminDashboardContent.propTypes = {
  closeLoader: PropTypes.func,
};
export default AdminDashboardContent;
