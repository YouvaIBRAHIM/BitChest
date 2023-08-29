import { Skeleton } from "@mui/material";

export const UserCardSkeleton = () => {

  return (
    <>
        <Skeleton variant="rectangular" width={"100%"} height={150} />
        <div className="flex justify-center">
            <Skeleton variant="circular" width={100} height={100}/>
        </div>
        <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
        <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
    </>
  )
};

export const UserFormSkeleton = () => {

    return (
      <div className="flex flex-col gap-5">
        <Skeleton variant="text" sx={{ fontSize: '2rem' }}/>
        <Skeleton variant="text" sx={{ fontSize: '3rem' }}/>

        <div className="flex gap-5">
            <Skeleton variant="text" sx={{ fontSize: '3rem' }}  className="basis-1/2"/>
            <Skeleton variant="text" sx={{ fontSize: '3rem' }}  className="basis-1/2"/>
        </div>
        <Skeleton variant="text" sx={{ fontSize: '3rem' }}/>

        <Skeleton variant="text" sx={{ fontSize: '2rem' }}/>
      </div>
    )
};

export const UserPasswordFormSkeleton = () => {

    return (
      <div className="flex flex-col gap-5">
        <Skeleton variant="text" sx={{ fontSize: '2rem' }}/>
        <Skeleton variant="text" sx={{ fontSize: '3rem' }}/>
        <Skeleton variant="text" sx={{ fontSize: '3rem' }}/>
        <Skeleton variant="text" sx={{ fontSize: '3rem' }}/>
        <Skeleton variant="text" sx={{ fontSize: '2rem' }}/>
      </div>
    )
};
  


