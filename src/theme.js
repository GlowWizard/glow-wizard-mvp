// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#BDB2C3", // Lavender
      contrastText: "#5C5751", // Charcoal for text
    },
    background: {
      default: "#EBEAEB", // Off-white background
      paper: "#FFFFFF",   // True white for cards
    },
    text: {
      primary: "#5C5751", // Charcoal
      secondary: "#BDB2C3", // Lavender
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
    h1: { fontFamily: "Georgia, serif" },
    h2: { fontFamily: "Georgia, serif" },
    h3: { fontFamily: "Georgia, serif" },
    h4: { fontFamily: "Georgia, serif" },
    h5: { fontFamily: "Georgia, serif" },
    h6: { fontFamily: "Georgia, serif" },
    button: { textTransform: "none" },
  },
  shape: {
    borderRadius: 18,
  },
});

export default theme;
