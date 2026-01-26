import {
  Skeleton,
  Box,
  Divider,
  ListItem,
  ListItemAvatar,
  List,
  // ListItemText,
  // Typography,
} from "@mui/material";
import Card from "../Card";
//import React from "react";

const LoginListSkeleton = () => (
  <Card style={{ padding: "2rem" }}>
    <Skeleton variant="text" width="20rem" sx={{ mb: "1rem" }} />

    {[...Array(3)].map((_, index) => (
      <List
        sx={{
          width: "100%",

          marginBottom: "-1.5rem",
        }}
        key={index}
      >
        <Divider
          sx={{ background: "var(--bg-color)" }}
          variant="inset"
          component="li"
        />

        <ListItem
          alignItems="flex-start"
          sx={{ alignItems: "center", pl: "0", pr: "0" }}
        >
          <ListItemAvatar sx={{ display: "flex", alignItems: "center" }}>
            <Skeleton variant="circular" width={35} height={35} />
          </ListItemAvatar>

          <Box
            sx={{
              display: "flex",
              gap: "2rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <Skeleton
                variant="rounded"
                width="14rem"
                height="3.5rem"
                sx={{ borderRadius: "2rem" }}
              />

              <Skeleton
                variant="rounded"
                width="14rem"
                height="3.5rem"
                sx={{ borderRadius: "2rem" }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <Skeleton variant="text" width="15rem" />

              <Skeleton variant="text" width="30rem" />
            </Box>
          </Box>
        </ListItem>
      </List>
    ))}
  </Card>
);

export default LoginListSkeleton;
