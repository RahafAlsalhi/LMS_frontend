import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  Stack,
} from "@mui/material";
import Layout from "@components/common/Layout";
import { useEffect } from "react";
const Terms = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
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
              Terms of Service
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Terms Content */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md">
          <Paper elevation={2} sx={{ p: { xs: 3, md: 6 }, borderRadius: 3 }}>
            <Stack spacing={4}>
              {/* Introduction */}
              <Box>
                <Typography variant="h4" fontWeight={600} mb={3}>
                  Welcome to EduHikerz
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  These Terms of Service ("Terms") govern your use of the
                  EduHikerz platform operated by Al Hussein Technical University
                  ("we," "us," or "our"). By accessing or using our service, you
                  agree to be bound by these Terms.
                </Typography>
              </Box>

              <Divider />

              {/* Acceptance of Terms */}
              <Box>
                <Typography variant="h5" fontWeight={600} mb={2}>
                  1. Acceptance of Terms
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  By creating an account or using our platform, you acknowledge
                  that you have read, understood, and agree to be bound by these
                  Terms and our Privacy Policy.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  If you do not agree to these Terms, please do not use our
                  services.
                </Typography>
              </Box>

              {/* Account Registration */}
              <Box>
                <Typography variant="h5" fontWeight={600} mb={2}>
                  2. Account Registration
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  To access certain features, you must register for an account.
                  You agree to:
                </Typography>
                <Stack spacing={1} sx={{ ml: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    • Provide accurate and complete information
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Maintain the security of your password
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Accept responsibility for all activities under your
                    account
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Notify us immediately of any unauthorized use
                  </Typography>
                </Stack>
              </Box>

              {/* Course Access and Use */}
              <Box>
                <Typography variant="h5" fontWeight={600} mb={2}>
                  3. Course Access and Use
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Upon enrollment and payment, you receive a limited,
                  non-exclusive, non-transferable license to access and use
                  course materials for personal, non-commercial purposes.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  You may not:
                </Typography>
                <Stack spacing={1} sx={{ ml: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    • Share your account credentials with others
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Download, copy, or redistribute course materials
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Use content for commercial purposes without permission
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Reverse engineer or attempt to extract source code
                  </Typography>
                </Stack>
              </Box>
              {/* Intellectual Property */}
              <Box>
                <Typography variant="h5" fontWeight={600} mb={2}>
                  4. Intellectual Property
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  All course materials, including videos, texts, graphics, and
                  software, are owned by EduHikerz or our content partners and
                  are protected by copyright laws.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  You retain ownership of any original work you create during
                  courses, but grant us a license to use such work for
                  educational and promotional purposes.
                </Typography>
              </Box>

              {/* User Conduct */}
              <Box>
                <Typography variant="h5" fontWeight={600} mb={2}>
                  5. User Conduct
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  You agree to use our platform responsibly and not to:
                </Typography>
                <Stack spacing={1} sx={{ ml: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    • Violate any laws or regulations
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Harass, abuse, or harm other users
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Post inappropriate or offensive content
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Attempt to hack or disrupt our systems
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Use the platform for spam or unauthorized marketing
                  </Typography>
                </Stack>
              </Box>

              {/* Privacy and Data Protection */}
              <Box>
                <Typography variant="h5" fontWeight={600} mb={2}>
                  6. Privacy and Data Protection
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Your privacy is important to us. Our collection and use of
                  personal information is governed by our Privacy Policy, which
                  is incorporated into these Terms by reference.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  We comply with applicable data protection laws and implement
                  appropriate security measures to protect your information.
                </Typography>
              </Box>

              {/* Disclaimers */}
              <Box>
                <Typography variant="h5" fontWeight={600} mb={2}>
                  7. Disclaimers
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Our platform is provided "as is" without warranties of any
                  kind. We do not guarantee that our service will be
                  uninterrupted, error-free, or meet your specific requirements.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  While we strive to provide high-quality education, we cannot
                  guarantee specific outcomes or job placement results.
                </Typography>
              </Box>

              {/* Limitation of Liability */}
              <Box>
                <Typography variant="h5" fontWeight={600} mb={2}>
                  8. Limitation of Liability
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  To the maximum extent permitted by law, EduHikerz shall not be
                  liable for any indirect, incidental, special, or consequential
                  damages arising from your use of our platform.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Our total liability shall not exceed the amount you paid for
                  the specific course giving rise to the claim.
                </Typography>
              </Box>

              {/* Termination */}
              <Box>
                <Typography variant="h5" fontWeight={600} mb={2}>
                  9. Termination
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  We may terminate or suspend your account immediately if you
                  violate these Terms. You may also terminate your account at
                  any time by contacting our support team.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Upon termination, your right to access course materials will
                  cease, though certain provisions of these Terms will survive
                  termination.
                </Typography>
              </Box>

              {/* Governing Law */}
              <Box>
                <Typography variant="h5" fontWeight={600} mb={2}>
                  10. Governing Law
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  These Terms are governed by the laws of the Hashemite Kingdom
                  of Jordan. Any disputes will be resolved in the courts of
                  Jordan.
                </Typography>
              </Box>

              <Divider />

              {/* Contact Information */}
              <Box>
                <Typography variant="h5" fontWeight={600} mb={2}>
                  Contact Us
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  If you have questions about these Terms, please contact us:
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Email:</strong> legal@eduhikerz.com
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

export default Terms;
