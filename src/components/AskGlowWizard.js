import React from "react";
import { Container, Paper, Button, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function AskGlowWizard() {
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
        <Button
          variant="text"
          component={RouterLink}
          to="/profile"
          sx={{ mb: 2 }}
        >
          ← Back to Profile
        </Button>
        <Typography variant="h4" gutterBottom>
          Ask Glow Wizard (AI Chat)
        </Typography>
        <Typography variant="body1" sx={{ mt: 4 }}>
          The Glow Wizard chatbot will answer your skincare questions, coming soon!
        </Typography>
      </Paper>
    </Container>
  );
}

export default AskGlowWizard;
