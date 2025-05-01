import * as React from "react";
import Typography from "@mui/material/Typography";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

function PageTitle({title, navLinks}) {

    const navigate = useNavigate();

    const handleClick = (link) => {
      navigate(link);
    };
  
    return (
        <Box role="presentation" width={"100%"} sx={{ p: 0 }}>
            <Breadcrumbs separator="/" aria-label="breadcrumb">
                {navLinks.map((item) => (
                    item.hidden !== null && item.hidden === true  ? null : (
                        <Link underline="hover" sx={{ cursor: 'pointer' }} color="inherit" key={item.label} onClick={() => handleClick(item.link)}>
                            <Typography component="h5" variant="h8" color="text.disabled" gutterBottom> {item.label} </Typography>
                        </Link>
                    )
                ))}
                { navLinks.length > 0 && (
                    <Typography component="h5" variant="h8" color="text.primary" gutterBottom > {title}</Typography>
                )}
            </Breadcrumbs>
        </Box>
    );
}

export default PageTitle;
