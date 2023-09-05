import { Box, Skeleton } from "@mui/material";

export const BalanceCardSkeleton = () => {

  return (
    <Box
      className="w-full"
    >
        <Skeleton variant="rectangular" width={"100%"} height={150} />
        <div className="flex justify-center">
            <Skeleton variant="circular" width={200} height={200}/>
        </div>
        <div className="flex justify-center gap-2 w-full">
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} className="w-5/12"/>
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} className="w-5/12"/>
        </div>
    </Box>
  )
};

  


