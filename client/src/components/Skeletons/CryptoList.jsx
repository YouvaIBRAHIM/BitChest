import { Box, Skeleton } from "@mui/material";

export const CryptoListSkeleton = () => {

  return (
    <Box className="flex flex-col gap-2">
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

