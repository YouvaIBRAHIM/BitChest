import { Box, Skeleton } from "@mui/material";

export const TransactionCardSkeleton = () => {

  return (
    <Box className="flex flex-col items-center gap-2 m-5">
      <Box className="flex justify-center gap-2 w-full">
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} className="w-4/12"/>
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} className="w-4/12"/>
      </Box>
      <Skeleton variant="text" sx={{ fontSize: '1rem', mb: 2 }} className='w-10/12'/>

      <Skeleton variant="text" sx={{ fontSize: '1rem' }} className='w-10/12'/>
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} className='w-10/12'/>
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} className='w-10/12'/>

      <Box className="flex gap-2 w-6/12 self-end mt-5">
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} className='w-9/12'/>
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} className='w-9/12'/>
      </Box>
    </Box>
  )
};
  


