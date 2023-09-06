import { Box, Skeleton } from "@mui/material";

export const CryptoListCardSkeleton = () => {

  return (
    <Box className="flex flex-col gap-2">
        <Skeleton variant="rectangular" width={"100%"} height={150} />
        <Box>
          <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
        </Box>
    </Box>
  )
};

