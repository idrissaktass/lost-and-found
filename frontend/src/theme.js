import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#ac5959",
    },
    error: {
      main: "#f44336",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: "Georgia",
    h1: {
      fontSize: "1.7rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 600,
    },
    h2Light: {
      fontSize: "1.5rem",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "1.2rem",
      lineHeight: 1.5,
    },
    em: {
      fontSize: "0.8rem",
      lineHeight: 1.5,
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
