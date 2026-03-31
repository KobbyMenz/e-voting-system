import { Skeleton, Box } from "@mui/material";
import Card from "../Card/Card";

const ElectionListSkeleton = () => (
  <Card style={{ padding: "2rem" }}>
    {[...Array(5)].map((_, index) => (
      <Box key={index}>
        <Skeleton
          key={index}
          variant="rounded"
          width="100%"
          height={80}
          sx={{ mb: 1 }}
        />

        <Box
          display="flex"
          gap="1rem"
          sx={{ position: "absolute", right: "6rem", marginTop: "-8.5rem" }}
        >
          <Skeleton
            variant="rounded"
            height="6.8rem"
            // sx={{
            //   background: "var(--nav-bg)",
            // }}
            width="20rem"
          />

          <Skeleton
            variant="rounded"
            height="6.8rem"
            // sx={{
            //   background: "var(--nav-bg)",
            // }}
            width="20rem"
          />

          <Skeleton
            variant="circular"
            height="3rem"
            sx={{
              background: "var(--nav-bg)",
              marginTop: "2rem",
            }}
            width="3rem"
          />
        </Box>
      </Box>
    ))}

    {/* <Skeleton variant="rounded" width={100} height={36} /> */}
  </Card>
);

export default ElectionListSkeleton;
