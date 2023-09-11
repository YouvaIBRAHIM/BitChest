import { Box, Skeleton } from "@mui/material";

const ServiceFeesFormSkeleton = () => {

    return (
      <Box
        className="flex gap-2"
        sx={{
          maxWidth: 300
        }}
      >
          <Skeleton variant="text" sx={{ fontSize: '3rem' }}  className="basis-2/3"/>
          <Skeleton variant="text" sx={{ fontSize: '3rem' }}  className="basis-1/3"/>
      </Box>
    )
}

export default ServiceFeesFormSkeleton;