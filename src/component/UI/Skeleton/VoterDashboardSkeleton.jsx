import React from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  Chip,
  Skeleton,
  Card,
  CardContent,
  Stack,
  Divider,
  Button,
  //   alpha,
  //   useTheme
} from "@mui/material";
import { HowToVote as HowToVoteIcon } from "@mui/icons-material";

const VoterDashboardSkeleton = () => {
  //const theme = useTheme();

  return (
    <Container maxWidth="xlg" sx={{ py:1 }}>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          
          //   overflow: "hidden",
          bgcolor: "background.paper",
          animation: "pulse 1.5s ease-in-out infinite",
          "@keyframes pulse": {
            "0%": { opacity: 1 },
            "50%": { opacity: 0.8 },
            "100%": { opacity: 1 },
          },
        }}
      >
        {/* Header Section Skeleton */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 1,
              // margin: "0 auto",
            }}
          >
            <div>
              <Skeleton variant="text" width={280} height={48} />

              <Skeleton variant="text" width={280} height={28} />
            </div>
          </Box>
        </Box>

        {/* Voting Section Skeleton */}
        <Box
          sx={{
            p: 3,

            margin: "2rem 0",
          }}
        >
          {/* <Skeleton variant="text" width={100} height={40} sx={{ mb: 2 }} /> */}

          {/* Candidate Cards Skeleton */}
          <Stack spacing={2}>
            {[1, 2, 3].map((item) => (
              <Card
                key={item}
                variant="outlined"
                sx={{
                  borderColor: "divider",
                  transition: "all 0.2s ease",
                }}
              >
                <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 2,
                      // alignItems: "center",
                      // display: "grid",
                      // gridTemplateColumns:
                      //   "repeat(auto-fill, minmax(30rem, 1fr))",
                    }}
                  >
                    {[1, 2].map((item) => (
                      <Card
                        key={item}
                        sx={{
                          width: "45%",
                          display: "flex",
                          alignItems: "center",

                          gap: 2,
                          p: 1,
                        }}
                      >
                        <Skeleton
                          variant="rounded"
                          width={"50%"}
                          height={180}
                          sx={{ ml: 1 }}
                        />

                        <Skeleton variant="text" width={"60%"} height={32} />
                      </Card>
                    ))}

                    {/*======= button =======*/}
                    <Skeleton
                      variant="rounded"
                      height="4.5rem"
                      sx={{
                        borderRadius: "2rem",
                        background: "var(--bg-color)",
                        margin: "auto",
                      }}
                      width="20%"
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>

        <Divider />

        {/* Footer Section Skeleton */}
        <Box sx={{ p: 3, bgcolor: "grey.50" }}>
          <Stack spacing={3}>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={52}
              sx={{ borderRadius: 2 }}
            />
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default VoterDashboardSkeleton;
