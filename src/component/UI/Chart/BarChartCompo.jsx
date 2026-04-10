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
//import { useEffect, useState } from "react";
//import axios from "axios";
import PropTypes from "prop-types";
import FormatCurrency from "../../Functions/FormatCurrency";
import ChartSkeleton from "../Skeleton/ChartSkeleton";
import formatNumberToK from "../../Functions/formatNumberToK";
import { useTheme } from "../../../context/useTheme";
import { LabelList } from "recharts";
//import app_api_url from "../../../app_api_url";

//import FormatCurrency from "../../Functions/FormatCurrency";

const BarChartCompo = ({
  candidatesRow = [],
  name = "name",
  total_vote = "votes",
}) => {
  const { isDarkTheme } = useTheme();

  return (
    <div>
      <Paper
        sx={{
          paddingTop: 2,
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
            data={candidatesRow}
            margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={name} />
            <YAxis tickFormatter={formatNumberToK} />
            <Tooltip
              // formatter={(value) => formatNumberToK(value)}
              formatter={(value, name, props) => {
                const percentage = props.payload.percentage;
                return [`${formatNumberToK(value)} (${percentage})`, "Votes"];
              }}
              contentStyle={{
                // color: "#000",
                backgroundColor: isDarkTheme
                  ? "var(--bg-color2)"
                  : "var(--bg-color2)",
                border: "0.1rem solid var(--text-color)",
                borderRadius: "0.8rem",
              }}
            />
            <Bar dataKey={total_vote} fill="var(--primary)" barSize={"100"}>
              <LabelList
                dataKey="percentage"
                position="top"
                formatter={(value) => `${value}`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </div>
  );
};
BarChartCompo.propTypes = {
  year: PropTypes.number,
  candidatesRow: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      total_vote: PropTypes.number.isRequired,
    }),
  ),
};
export default BarChartCompo;
