import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingScreen = ({ message = "Cargando..." }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      gap: 2,
      backgroundColor: "background.default",
    }}
  >
    <CircularProgress size={48} thickness={4} />
    <Typography variant="body2" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

export default LoadingScreen;
