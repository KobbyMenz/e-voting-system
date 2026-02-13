import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

const SystemOverviewSkeleton = () => {
  return (
    <Box
      // container
      wrap="wrap"
      justifyContent="center"
      alignItems="center"
      columnGap="1rem"
      rowGap="1rem"
      paddingTop="1rem"
      paddingBottom="1rem"
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(30rem, 1fr))",
      }}
    >
      {Array.from(new Array(8)).map((item, index) => (
        <Box key={index}>
          {
            <Skeleton
              sx={{ borderRadius: "1rem",background:"var(--bg-color2)" }}
              variant="rounded"
              width={"100%"}
              height={98}
            />
          }
        </Box>
      ))}
    </Box>
  );
};

export default SystemOverviewSkeleton;
