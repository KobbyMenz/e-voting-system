import { Skeleton, Box } from "@mui/material";

const WelcomeMessageSkeleton = () => (
  <>
    {/*======= text =======*/}
    <Box pt={2} pb={2}>
      <Skeleton variant="text" width="15%" />
      <Skeleton variant="text" width="35%" sx={{marginTop:"1rem"}}/>
    </Box>
  </>
);

export default WelcomeMessageSkeleton;
