import dayjs from "dayjs";
//import formatDateTime from "../../Functions/formatDateTime";
import PaginationTable from "../../UI/PaginationTable/PaginationTable";

const allVoters = [
  {
    id: 2025001,
    image: "",
    name: "Adu-Boahen Charles",
    dob: "2006-10-02",
    hasVoted: "true",
  },

  {
    id: 2025002,
    image: "",
    name: "Emmanuella 09",
    dob: "2010-05-07",
    hasVoted: "false",
  },
];

const RegisterVotersContent = () => {
  //columns for pagination table (ManageUserPT)
  const columns = [
    { field: "sn", headerName: "S/N" },
    { field: "id", headerName: "ID" },
    { field: "image", headerName: "Photo", type: "image" },
    { field: "name", headerName: "Full Name" },
    { field: "dob", headerName: "DOB", type: "dob" },
    { field: "hasVoted", headerName: "Has Voted" },
  ];

  const rows = allVoters.map((voter, index) => ({
    sn: index + 1,
    id: voter.id,
    image: voter.image,
    name: voter.name,
    dob: dayjs(voter.dob).format("DD MMM, YYYY"),
    hasVoted: voter.hasVoted,
  }));

  return (
    <>
      <div className="table_wrapper">
        <PaginationTable
          // key={id}
          columns={columns}
          rows={rows}
          // onEdit={onEdit}
          // onDelete={onDelete}
          // onAdd={onAdd}
        />
      </div>
    </>
  );
};
export default RegisterVotersContent;
