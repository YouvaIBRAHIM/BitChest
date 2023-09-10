import { Box, Typography } from "@mui/material";
import { Robot } from "@phosphor-icons/react";

/**
 * 
 * @returns La page 404
 */
const PageNotFound = () => {

    return (
        <Box
            className="flex flex-col gap-5 items-center justify-center w-full mt-20"
        >
            <Robot size={96} weight="duotone" />
            <Typography variant="p" className="text-5xl">Page introuvable</Typography>
        </Box>
    );
};

export default PageNotFound;