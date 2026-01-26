import { Skeleton, Box } from "@mui/material";
import Card from "../Card";

const ChartSkeleton = () => (
  <Card style={{ padding: "2rem" }}>
    {[...Array(1)].map((_, index) => (
      <Box key={index}>
        <Skeleton
          key={index}
          variant="rounded"
          width="100%"
          height={140}
          sx={{ mb: 1 }}
        />
      </Box>
    ))}

    {/* <Skeleton variant="rounded" width={100} height={36} /> */}
  </Card>
);

export default ChartSkeleton;
