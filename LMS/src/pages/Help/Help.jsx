import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import Layout from "@components/common/Layout";
import { useEffect } from "react";

const Help = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const faqs = [
    {
      question: "How do I enroll in a course?",
      answer:
        "To enroll in a course, browse our course catalog, select the course you want, and click 'Enroll Now'. You'll need to create an account to access the course materials.",
    },
    {
      question: "Can I access courses on mobile devices?",
      answer:
        "Yes! EduHikerz is fully responsive and works on all devices including smartphones, tablets, and desktop computers. You can learn anywhere, anytime.",
    },
    {
      question: "How long do I have access to a course?",
      answer:
        "Once you enroll in a course, you have lifetime access to all course materials, including any future updates to the content.",
    },
    {
      question: "Do you offer certificates?",
      answer:
        "Yes, upon successful completion of a course, you'll receive a certificate of completion that you can share on LinkedIn or add to your resume.",
    },
    {
      question: "What if I need help during a course?",
      answer:
        "We provide multiple support channels including discussion forums and our support team available via email and chat.",
    },
  ];

  const helpCategories = [
    {
      title: "Getting Started",
      description:
        "Learn how to create an account and enroll in your first course",
      icon: "🚀",
    },
    {
      title: "Course Access",
      description: "Troubleshoot course access and technical issues",
      icon: "📚",
    },
    {
      title: "Certificates",
      description: "Information about course certificates and credentials",
      icon: "🏆",
    },
  ];

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
              Help Center
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto", mb: 4 }}
            >
              Find answers to common questions and get the support you need
            </Typography>
          </Box>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          {/* Help Categories */}
          <Typography variant="h4" fontWeight={700} mb={4} textAlign="center">
            Browse by Category
          </Typography>
          <Grid container spacing={3} justifyContent="center" mb={6}>
            {helpCategories.map((category, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    textAlign: "center",
                    p: 2,
                    height: "100%",
                    cursor: "pointer",
                    "&:hover": { transform: "translateY(-4px)" },
                    transition: "transform 0.3s",
                  }}
                >
                  <CardContent>
                    <Typography variant="h3" mb={2}>
                      {category.icon}
                    </Typography>
                    <Typography variant="h6" fontWeight={600} mb={1}>
                      {category.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* FAQ Section */}
          <Typography variant="h4" fontWeight={700} mb={4} textAlign="center">
            Frequently Asked Questions
          </Typography>
          <Box sx={{ maxWidth: 800, mx: "auto" }}>
            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                sx={{ mb: 2, borderRadius: 2, "&:before": { display: "none" } }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" fontWeight={600}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" color="text.secondary">
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default Help;
