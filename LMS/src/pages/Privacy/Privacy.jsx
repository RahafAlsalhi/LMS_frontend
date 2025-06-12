import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  Stack,
  Chip,
} from "@mui/material";
import {
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  Share as ShareIcon,
} from "@mui/icons-material";
import Layout from "@components/common/Layout";
import { useEffect } from "react";

const Privacy = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const dataTypes = [
    "Personal Information (name, email, phone)",
    "Account Information (username, password)",
    "Educational Progress (course completion, grades)",
    "Technical Data (IP address, browser type)",
    "Usage Analytics (page views, time spent)",
    "Communication Records (support tickets, feedback)",
  ];

  const rights = [
    "Access your personal data",
    "Correct inaccurate information",
    "Delete your account and data",
    "Export your data",
    "Restrict processing",
    "Object to certain uses",
  ];

  return (
    <Layout>
      {/* Hero Section */}
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
              Privacy Policy
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto", mb: 3 }}
            >
              We are committed to protecting your privacy and personal
              information
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Privacy Content */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md">
          <Paper elevation={2} sx={{ p: { xs: 3, md: 6 }, borderRadius: 3 }}>
            <Stack spacing={4}>
              {/* Introduction */}
              <Box>
                <Typography variant="h4" fontWeight={600} mb={3}>
                  Your Privacy Matters
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  This Privacy Policy explains how EduHikerz ("we," "us," or
                  "our") collects, uses, and protects your personal information
                  when you use our educational platform.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  We are committed to transparency and giving you control over
                  your personal data in compliance with applicable privacy laws.
                </Typography>
              </Box>

              <Divider />

              {/* Information We Collect */}
              <Box>
                <Typography variant="h5" fontWeight={600} mb={2}>
                  1. Information We Collect
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  We collect information you provide directly and automatically
                  when you use our platform:
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Data Types We Collect:
                  </Typography>
                  <Stack spacing={1}>
                    {dataTypes.map((type, index) => (
                      <Box
                        key={index}
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <SecurityIcon
                          sx={{ fontSize: 16, color: "primary.main" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {type}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Box>

              {/* How We Use Information */}
              <Box>
                <Typography variant="h5" fontWeight={600} mb={2}>
                  2. How We Use Your Information
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  We use your information to provide, improve, and personalize
                  our educational services:
                </Typography>
                <Stack spacing={1} sx={{ ml: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    • Provide access to courses and learning materials
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Track your learning progress and provide certificates
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Send important updates about courses and platform changes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Provide customer support and respond to inquiries
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Analyze usage patterns to improve our platform
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Prevent fraud and ensure platform security
                  </Typography>
                </Stack>
              </Box>

              {/* Information Sharing */}
              <Box>
                <Typography variant="h5" fontWeight={600} mb={2}>
                  3. Information Sharing
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  We do not sell your personal information. We may share
                  information only in these limited cases:
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} mb={1}>
                      Service Providers
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      With trusted third-party services that help us operate our
                      platform (payment processors, cloud hosting, email
                      services).
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} mb={1}>
                      Legal Requirements
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      When required by law, court order, or to protect our
                      rights and safety.
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} mb={1}>
                      Business Transfers
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      In connection with a merger, acquisition, or sale of
                      assets (with appropriate privacy protections).
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {/* Data Security */}
              <Box>
                <Typography variant="h5" fontWeight={600} mb={2}>
                  4. Data Security
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  We implement industry-standard security measures to protect
                  your information:
                </Typography>
                <Stack spacing={1} sx={{ ml: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    • SSL/TLS encryption for data transmission
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Secure data storage with encryption at rest
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Regular security audits and vulnerability assessments
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Limited access controls and employee training
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Multi-factor authentication for administrative accounts
                  </Typography>
                </Stack>
              </Box>

              {/* Your Rights */}
              <Box>
                <Typography variant="h5" fontWeight={600} mb={2}>
                  5. Your Privacy Rights
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  You have the following rights regarding your personal
                  information:
                </Typography>
                <Stack spacing={1}>
                  {rights.map((right, index) => (
                    <Box
                      key={index}
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <VisibilityIcon
                        sx={{ fontSize: 16, color: "primary.main" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {right}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  To exercise these rights, please contact us at
                  privacy@eduhikerz.com
                </Typography>
              </Box>

              {/* Cookies and Tracking */}
              <Box>
                <Typography variant="h5" fontWeight={600} mb={2}>
                  6. Cookies and Tracking
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  We use cookies and similar technologies to enhance your
                  experience:
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} mb={1}>
                      Essential Cookies
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Required for platform functionality (login sessions,
                      security).
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} mb={1}>
                      Analytics Cookies
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Help us understand how you use our platform to improve
                      services.
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} mb={1}>
                      Preference Cookies
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Remember your settings and personalize your experience.
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {/* Data Retention */}
              <Box>
                <Typography variant="h5" fontWeight={600} mb={2}>
                  7. Data Retention
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  We retain your personal information only as long as necessary
                  to provide our services and comply with legal obligations:
                </Typography>
                <Stack spacing={1} sx={{ ml: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    • Account information: Until account deletion
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Course progress: 7 years for certification purposes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Support communications: 3 years
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Analytics data: Anonymized after 2 years
                  </Typography>
                </Stack>
              </Box>

              {/* International Transfers */}
              <Box>
                <Typography variant="h5" fontWeight={600} mb={2}>
                  8. International Data Transfers
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Your information may be transferred to and processed in
                  countries other than Jordan. We ensure appropriate safeguards
                  are in place to protect your data during international
                  transfers.
                </Typography>
              </Box>

              {/* Children's Privacy */}
              <Box>
                <Typography variant="h5" fontWeight={600} mb={2}>
                  9. Children's Privacy
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Our platform is not intended for children under 16. We do not
                  knowingly collect personal information from children under 16.
                  If we become aware of such collection, we will delete the
                  information promptly.
                </Typography>
              </Box>

              {/* Changes to Policy */}
              <Box>
                <Typography variant="h5" fontWeight={600} mb={2}>
                  10. Changes to This Policy
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  We may update this Privacy Policy periodically. We will notify
                  you of significant changes via email or platform notifications
                  at least 30 days before the changes take effect.
                </Typography>
              </Box>

              <Divider />

              {/* Contact Information */}
              <Box>
                <Typography variant="h5" fontWeight={600} mb={2}>
                  Contact Our Privacy Team
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  If you have questions about this Privacy Policy or your data:
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Email:</strong> privacy@eduhikerz.com
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Data Protection Officer:</strong> dpo@eduhikerz.com
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Address:</strong> Al Hussein Technical University,
                    Amman, Jordan
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Phone:</strong> +962 6 1234 5678
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </Layout>
  );
};

export default Privacy;
