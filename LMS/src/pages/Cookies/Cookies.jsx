import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Switch,
  FormControlLabel,
} from "@mui/material";
import Layout from "@components/common/Layout";
import { useEffect } from "react";

const Cookies = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <Layout>
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%)",
          py: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center">
            <Typography
              variant="h2"
              fontWeight={700}
              mb={2}
              sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
            >
              Cookie Policy
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto" }}
            >
              How we use cookies to improve your learning experience
            </Typography>
          </Box>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md">
          <Paper elevation={2} sx={{ p: { xs: 3, md: 6 }, borderRadius: 3 }}>
            <Stack spacing={4}>
              <Box>
                <Typography variant="h4" fontWeight={600} mb={3}>
                  What Are Cookies?
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Cookies are small text files stored on your device when you
                  visit our website. They help us provide you with a better,
                  faster, and safer experience.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h5" fontWeight={600} mb={2}>
                  Types of Cookies We Use
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Essential Cookies
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Required for basic site functionality, login sessions, and
                      security.
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Analytics Cookies
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Help us understand how you use our platform to improve our
                      services.
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Preference Cookies
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Remember your settings and personalize your experience.
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Box>
                <Typography variant="h5" fontWeight={600} mb={2}>
                  Managing Cookies
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  You can control cookies through your browser settings.
                  However, disabling certain cookies may affect the
                  functionality of our platform.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  For questions about our cookie policy, contact us at
                  privacy@eduhikerz.com
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </Layout>
  );
};

export default Cookies;
