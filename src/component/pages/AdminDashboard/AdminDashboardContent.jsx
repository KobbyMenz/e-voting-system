import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Box } from "@mui/material";
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
import EditElectionModal from "../../UI/Modals/EditElectionModal";
import SearchBar from "../../UI/SearchBar/SeachBar";
import EditCandidateModal from "../../UI/Modals/EditCandidateModal";
import useDeleteHook from "../../CustomHooks/useDeleteHook";
import { printElectionResults } from "../../Functions/printElectionResults";
import { authLocalStorage } from "../../Utils/authLocalStorage";
import app_api_url from "../../../app_api_url";
import useFetch from "../../CustomHooks/useFetch";
import useFetchDataCount from "../../CustomHooks/useFetchDataCount";
//import TableSkeleton from "../../UI/Skeleton/TableSkeleton";
import SystemOverviewSkeleton from "../../UI/Skeleton/SystemOverviewSkeleton";
//import WelcomeMessageSkeleton from "../../UI/Skeleton/WelcomeMessageSkeleton";
import ElectionListSkeleton from "../../UI/Skeleton/ElectionListSkeleton";

// Default candidates list
const DEFAULT_CANDIDATES = [];

// Helper function to convert relative image paths to full URLs

// Table columns definition
const columns = [
  { field: "sn", headerName: "S/N" },
  { field: "id", headerName: "ID" },
  { field: "image", headerName: "Photo", type: "image" },
  { field: "name", headerName: "Candidate Name", type: "candidateName" },
  { field: "position", headerName: "Position", type: "position" },
  { field: "votes", headerName: "No. of Votes", type: "votes" },
  { field: "percentage", headerName: "Percentage", type: "percentage" },
];

// Function to create a new election instance with candidates
const createElectionInstance = (
  electionId,
  title,
  description,
  dateCreated,
  status,
  startDate,
  endDate,
  candidates = DEFAULT_CANDIDATES,
) => ({
  id: electionId,
  title: title,
  description: description,
  dateCreated: dateCreated,
  status: status,
  startDate: startDate,
  endDate: endDate,

  candidates: candidates.map((candidate, index) => ({
    sn: index + 1,
    id: candidate.candidateId || `candidate-${index}`,
    image: candidate.photo ? `${candidate.photo}` : "", // Maps database photo to image
    name: candidate.fullName || "N/A",
    position: candidate.position ? candidate.position : "N/A",
    votes: candidate.votes ? candidate.votes : 0,
    percentage: candidate.percentage ? `${candidate.percentage}%` : "0%",
  })),
});

const AdminDashboardContent = () => {
  // Auto-refresh election data every 60 seconds to check start/end dates
  const { data, setRefetch, error } = useFetch(
    `${app_api_url}/getAllElections`,
    60000, // Changed from 1000 (every 1 second) to 60000 (every 60 seconds) - 98% reduction in API calls!
  );

  //Getting all users details
  const allElections = useMemo(() => (data !== null ? data : []), [data]);

  // Group candidates by election ID - SORTED by creation order
  const candidatesByElection = useMemo(() => {
    const grouped = {};
    if (Array.isArray(allElections)) {
      allElections.forEach((row) => {
        if (!grouped[row.electionId]) {
          grouped[row.electionId] = [];
        }
        // Only add candidate if it exists (not null from LEFT JOIN)
        if (row.candidateId) {
          grouped[row.electionId].push(row);
        }
      });

      // Sort candidates within each election by their position in the data (order added)
      Object.keys(grouped).forEach((electionId) => {
        grouped[electionId].sort((a, b) => {
          // If both have a date field, sort by it; otherwise maintain data order
          if (a.dateAdded && b.dateAdded) {
            return (
              new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
            );
          }
          return 0;
        });
      });
    }
    return grouped;
  }, [allElections]);

  // Get unique elections - SORTED by dateCreated (oldest first)
  const uniqueElections = useMemo(() => {
    if (!Array.isArray(allElections)) return [];
    const seen = new Set();
    const unique = allElections.filter((election) => {
      if (seen.has(election.electionId)) return false;
      seen.add(election.electionId);
      return true;
    });

    // Sort by dateCreated (ascending - oldest/first created first)
    return unique.sort(
      (a, b) =>
        new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime(),
    );
  }, [allElections]);

  // Transform database elections into component election instances
  const election = useMemo(
    () =>
      uniqueElections.map((electionRow) =>
        createElectionInstance(
          electionRow.electionId,
          electionRow.title,
          electionRow.description,
          electionRow.dateCreated,
          electionRow.status,
          electionRow.startDate,
          electionRow.endDate,
          candidatesByElection[electionRow.electionId] || [], // Pass raw candidates, let createElectionInstance handle mapping
        ),
      ),
    [uniqueElections, candidatesByElection],
  );

  const [showAddElectionModal, setShowAddElectionModal] = useState(false);
  const [showEditElectionModal, setShowEditElectionModal] = useState(false);
  //const [addElection, setAddElection] = useState(election);
  const [expandedId, setExpandedId] = useState(null);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [submitCandidateData, setSubmitCandidateData] = useState({});
  const [showEditCandidateModal, setShowEditCandidateModal] = useState(false);
  const [submitElectionData, setSubmitElectionData] = useState({});
  //const [submitElectionId, setSubmitElectionId] = useState("");

  // Track initial load separately from polling refreshes
  const [initialLoading, setInitialLoading] = useState(true);
  const hasInitialized = useRef(false);

  // Only show skeleton on first load, not on polling refreshes
  useEffect(() => {
    if (data !== null && !hasInitialized.current) {
      hasInitialized.current = true;
      setInitialLoading(false);
    }
  }, [data]);

  // const { getNoOfVoters } = useFetch(`${app_api_url}/getNoOfVoters`);
  const { dataResult: totalVoters } = useFetchDataCount(
    "getNoOfVoters",
    "totalVoters",
  );

  const { dataResult: totalVoteCast } = useFetchDataCount(
    "getNoOfVoteCast",
    "totalVoteCast",
  );

  const { deleteData } = useDeleteHook();
  const authData = authLocalStorage();
  const userName = authData?.fullName?.split(" ")[0] || "Admin";

  //Refetch data handler
  const refetchHandler = useCallback(() => {
    setRefetch((prev) => !prev);
  }, [setRefetch]);

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
        id,
        name,
        image,
        dob,
        position,
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

  //console.log("All elections data: ", election);

  // Enhanced filtering to search across all fields of the election, including candidates
  // Preserves the sorted order from election array
  const filteredElectionRows = useMemo(
    () =>
      election
        .filter((row) =>
          Object.values(row).some((value) =>
            String(value).toLowerCase().includes(search.toLowerCase()),
          ),
        )
        // Maintain sort order by dateCreated
        .sort(
          (a, b) =>
            new Date(a.dateCreated).getTime() -
            new Date(b.dateCreated).getTime(),
        ),
    [election, search],
  );

  //////////////////////////////////////////////
  //Edit Election
  /////////////////////////////////////////////
  const onShowEditElectionHandler = useCallback(
    (electionId, title, description, dateCreated, startDate, endDate) => {
      setShowEditElectionModal(true);
      setSubmitElectionData({
        electionId,
        title,
        dateCreated,
        description,
        startDate,
        endDate,
      });
    },
    [],
  );

  /////////////////////////////////////////
  //delete election handler
  ////////////////////////////////////////
  const onDeleteElectionHandler = useCallback(
    (electionId) => {
      console.log("Delete election with ID:", electionId);
      if (window.confirm("Are you sure you want to delete this election?")) {
        //Hook to delete election
        deleteData(
          `deleteElection/${electionId}`,
          ToastHandler,
          refetchHandler,
        );
      }
    },
    [deleteData, ToastHandler, refetchHandler],
  );

  /////////////////////////////////////////
  //delete candidate handler
  ////////////////////////////////////////
  const onDeleteCandidateHandler = useCallback(
    (candidateId) => {
      if (window.confirm("Are you sure you want to delete this candidate?")) {
        //Hook to delete candidate
        deleteData(
          `deleteCandidate/${candidateId}`,
          ToastHandler,
          refetchHandler,
        );
      }
    },
    [deleteData, ToastHandler, refetchHandler],
  );

  /////////////////////////////////////////////////////////
  //* Handler to print all election results */
  /////////////////////////////////////////////////////
  const onPrintAllResultsHandler = useCallback(() => {
    if (Array.isArray(election) && election.length > 0) {
      printElectionResults(election, "Election Results Report");
    } else {
      Toast("info", "No elections to print");
    }
  }, [election]);

  const totalCandidates = useMemo(
    () =>
      Array.isArray(election)
        ? election.reduce(
            (total, item) => total + (item.candidates?.length || 0),
            0,
          )
        : 0,
    [election],
  );

  return (
    <Fragment>
      {/* {loading && <Loader />} */}

      {showModal && <Modal onCloseModal={closeShowModalHandler} />}

      {showAddElectionModal && (
        <AddElectionModal
          //onAddElection={onAddElectionHandler}

          toastModal={ToastHandler}
          setRefetch={refetchHandler}
          onCloseModal={closeShowAddElectionModalHandler}
        />
      )}

      {showEditElectionModal && (
        <EditElectionModal
          submitElectionData={submitElectionData}
          // onEditElection={onEditElectionHandler}
          toastModal={ToastHandler}
          setRefetch={refetchHandler}
          onCloseModal={closeShowEditElectionModalHandler}
        />
      )}

      {showAddCandidateModal && (
        <AddCandidateModal
          electionId={showAddCandidateModal}
          toastModal={ToastHandler}
          onCloseModal={closeShowAddCandidateModalHandler}
          setRefetch={refetchHandler}
          //onAddCandidate={() => {}}
        />
      )}

      {showEditCandidateModal && (
        <EditCandidateModal
          onSubmitCandidateData={submitCandidateData}
          toastModal={ToastHandler}
          setRefetch={refetchHandler}
          onCloseModal={closeShowEditCandidateModalHandler}
        />
      )}

      <div className={classes.content__container}>
        <Card className={"card__wrapper"}>
          {
            // initialLoading ? (
            //   <WelcomeMessageSkeleton />
            // ) :
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
          }
        </Card>

        <div className={` ${classes.system_overview_card}`}>
          {initialLoading ? (
            <SystemOverviewSkeleton />
          ) : (
            <section>
              <div className={classes.flexbox_container}>
                <div className={classes.card__box__container}>
                  <Card className={classes.card__box}>
                    <div className={classes.description__container}>
                      <div className={classes.description}>
                        <p>Number of Elections:</p>
                        <p className={classes.description_value}>
                          {election.length}
                        </p>
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
                        <p className={classes.description_value}>
                          {totalCandidates}
                        </p>
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
                        <p>{`Registered Voters:`}</p>
                        <p className={`${classes.description_value}`}>
                          {totalVoters}
                        </p>
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
                        <p>Total Votes Cast:</p>

                        <p className={` ${classes.description_value}`}>
                          {totalVoteCast}
                        </p>
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
          )}
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
                  <AddIcon /> Add Election
                </Button>
              </Box>
            </div>

            {initialLoading ? (
              <ElectionListSkeleton />
            ) : error ? (
              <Box
                sx={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "error.main",
                }}
              >
                <p>❌ Error loading elections: {error}</p>
                <Button onClick={() => setRefetch((prev) => !prev)}>
                  🔄 Retry
                </Button>
              </Box>
            ) : (
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
                        onDeleteCandidate={onDeleteCandidateHandler}
                        onDeleteElection={onDeleteElectionHandler}
                        onEditElection={onShowEditElectionHandler}
                        expanded={expandedId === item.id}
                        onExpandChange={onAccordionExpandChange}
                        // onclickAccordion={onclickAccordion(item.id)}
                      />
                    ))}
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
            )}
          </Card>
        </section>

        <div style={{ marginTop: "-1rem" }}>
          <Footer />
        </div>
      </div>
    </Fragment>
  );
};

export default AdminDashboardContent;
