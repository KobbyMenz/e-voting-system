// import React from "react";

import {
  BarChart,
  Bar,
  // LineChart,
  // Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
//import useTopProducts from "./useTopProducts";
//import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
//import Card from "../Card";
import { useEffect, useState } from "react";
//import axios from "axios";
import PropTypes from "prop-types";
import FormatCurrency from "../../Functions/FormatCurrency";
import ChartSkeleton from "../Skeleton/ChartSkeleton";
import formatNumberToK from "../../Functions/formatNumberToK";
import { useTheme } from "../../../context/useTheme";
//import app_api_url from "../../../app_api_url";

//import FormatCurrency from "../../Functions/FormatCurrency";

const BarChartCompo = () => {
  const { isDarkTheme } = useTheme();
  // const { topProducts, loading } = useTopProducts(); setRefetch
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  // const currentYear = props.year;
  //console.log("Year:", currentYear);
  useEffect(() => {
    const fetchNumberOfVotes = async () => {
      // Simulating API call
      setTimeout(() => {
        setData([
          { name: "Augustine Mensah", total_vote: 100 },
          { name: "John Doe", total_vote: 110 },
          { name: "Jane Smith", total_vote: 60 },
        ]);
        setLoading(false);
      }, 1000);
    };

    fetchNumberOfVotes();

    // const getSalesYear = async () => {
    //   try {
    //     const response = await axios.get(`${app_api_url}/getAllMonthlySales`);

    //     if (response.data.result) {
    //       setData(response.data.result);

    //       setLoading(false);
    //     }
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };
    // getSalesYear();

    // setRefetch((prev) => !prev);
  }, []);

  if (loading) {
    return <ChartSkeleton />;
  }

  return (
    <div>
      <Paper
        sx={{
          paddingTop: 1,
          paddingBottom: 1,
          paddingRight: 1,
          paddingLeft: 0,
          marginTop: 0,
          boxShadow: 3,
          borderRadius: "1rem",
          fontSize: "1.4rem",
          background: "var(--bg-color2)",
        }}
      >
        {/* <h3
          style={{
            textAlign: "left",
            paddingLeft: "2rem",
            color: "var(--primary)",
            fontWeight: "400",
          }}
        >
          Total Votes for Candidates
        </h3> */}
        <ResponsiveContainer width="100%" height={226}>
          <BarChart
            data={data}
            margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatNumberToK} />
            <Tooltip
              formatter={(value) => formatNumberToK(value)}
              contentStyle={{
                // color: "#000",
                backgroundColor: isDarkTheme ? "var(--bg-color2)" : "var(--bg-color2)",
                border: "0.1rem solid #ccc",
                borderRadius: "0.8rem",
              }}
            />
            <Bar dataKey="total_vote" fill="var(--primary)" barSize={"100"} />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* <Paper
        sx={{ padding: 2, marginTop: 0, boxShadow: 3, borderRadius: "1rem" }}
      >
        
        <h2 style={{ textAlign: "left", paddingLeft: "2rem" }}>
          Monthly Sales
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={data}
            margin={{ top: 0, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={`MONTH`} />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={"TOTAL_SALES"}
              //   stroke="#4CAF50"
              stroke="#006aa3"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

            <Line
              type="monotone"
              dataKey="QTY_SOLD"
              //   stroke="#4CAF50"
              stroke="#006aa3"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper> */}
    </div>
  );
};
BarChartCompo.propTypes = {
  year: PropTypes.number,
};
export default BarChartCompo;
