import React from "react";
import { Container, Paper, Button, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function Dashboard() {
  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          textAlign: "center",
          borderRadius: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome to Glow Wizard!
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Your personalized skincare journey starts here.
        </Typography>
        <Button
          variant="contained"
          component={RouterLink}
          to="/profile"
          sx={{ mt: 4, width: 220 }}
        >
          Go to My Profile
        </Button>
      </Paper>
    </Container>
  );
}

export default Dashboard;
