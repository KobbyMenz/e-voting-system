import { Skeleton, Box } from "@mui/material";
import Card from "../Card/Card";

const ElectionListSkeleton = () => (
  <Card style={{ padding: "2rem" }}>
    <Box
      display="flex"
      flexWrap={"wrap"}
      rowGap={1}
      columnGap={"20%"}
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      <Box width="30rem">
        {/*======= text =======*/}
        <Skeleton variant="text" width="70%" />
        <Skeleton variant="text" width="60%" />
      </Box>

      <Box
        display="flex"
        gap={1}
        flexGrow={1}
        justifyContent={"flex-end"}
        alignItems={"center"}
      >
        {/*======= textbox =======*/}
        <Skeleton
          sx={{ borderRadius: "1rem", maxWidth: "85%" }}
          variant="rounded"
          height="5rem"
          width="100%"
        />

        {/*======= button =======*/}
        <Skeleton
          variant="rounded"
          height="4.5rem"
          sx={{ borderRadius: "2rem", background: "var(--nav-bg)" }}
          width="13rem"
        />
      </Box>
    </Box>

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
              background: "var(--nav-bg)",marginTop:"2rem"
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
