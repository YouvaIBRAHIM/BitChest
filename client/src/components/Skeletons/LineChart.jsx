import { Skeleton } from "@mui/material";

export const LineChartSkeleton = () => {

    return (
      <div className="flex flex-col gap-2 w-full">
        <Skeleton variant="rectangular" className="w-full min-h-200 md:min-h-500" />

        <Skeleton variant="text" sx={{ fontSize: '2rem' }}/>
      </div>
    )
};


