import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";
import {
  School as SchoolIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const footerSections = {
    EduHikerz: [
      { label: "About Us", path: "/about" },
      { label: "Pathways", path: "/pathways" },
      { label: "Courses", path: "/courses" },
    ],
    "Stay Updated": [
      { label: "Help Center", path: "/help" },
      { label: "Contact Us", path: "/contact" },
    ],
    Legal: [
      { label: "Terms of Service", path: "/terms" },
      { label: "Privacy Policy", path: "/privacy" },
      { label: "Cookie Policy", path: "/cookies" },
    ],
  };

  const socialLinks = [
    {
      icon: FacebookIcon,
      url: "https://facebook.com/eduhikerz",
      label: "Facebook",
    },
    {
      icon: TwitterIcon,
      url: "https://twitter.com/eduhikerz",
      label: "Twitter",
    },
    {
      icon: LinkedInIcon,
      url: "https://linkedin.com/company/eduhikerz",
      label: "LinkedIn",
    },
    {
      icon: InstagramIcon,
      url: "https://instagram.com/eduhikerz",
      label: "Instagram",
    },
    {
      icon: YouTubeIcon,
      url: "https://youtube.com/eduhikerz",
      label: "YouTube",
    },
  ];

  const contactInfo = [
    {
      icon: EmailIcon,
      text: "contact@eduhikerz.com",
      href: "mailto:contact@eduhikerz.com",
    },
    { icon: PhoneIcon, text: "+962 6 1234 5678", href: "tel:+96261234567" },
    { icon: LocationIcon, text: "Amman, Jordan", href: "#" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#1A1A1A",
        color: "white",
        pt: 6,
        pb: 3,
        mt: "auto",
      }}
    >
      <Container maxWidth="xl">
        {/* Main Footer Content */}
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" mb={2}>
              <SchoolIcon
                sx={{
                  fontSize: 32,
                  color: "primary.light",
                  mr: 1,
                  transform: "rotate(-10deg)",
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg, #64B5F6 0%, #2196F3 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.5px",
                }}
              >
                EduHikerz
              </Typography>
            </Box>

            {/* Contact Info */}
            <Stack spacing={1} mb={3}>
              {contactInfo.map((contact, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  component={contact.href !== "#" ? "a" : "div"}
                  href={contact.href !== "#" ? contact.href : undefined}
                  sx={{
                    color: "grey.300",
                    textDecoration: "none",
                    "&:hover":
                      contact.href !== "#"
                        ? {
                            color: "primary.light",
                          }
                        : {},
                  }}
                >
                  <contact.icon
                    sx={{ fontSize: 18, mr: 1, color: "primary.light" }}
                  />
                  <Typography variant="body2">{contact.text}</Typography>
                </Box>
              ))}
            </Stack>

            {/* Social Links */}
            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                Follow Us
              </Typography>
              <Box display="flex" gap={1}>
                {socialLinks.map((social, index) => (
                  <IconButton
                    key={index}
                    component="a"
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    sx={{
                      color: "grey.400",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      "&:hover": {
                        color: "primary.light",
                        backgroundColor: "rgba(33, 150, 243, 0.1)",
                        borderColor: "primary.light",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <social.icon fontSize="small" />
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Footer Links */}
          {Object.entries(footerSections).map(([title, links]) => (
            <Grid item xs={12} sm={6} md={2.67} key={title}>
              <Typography
                variant="h6"
                fontWeight={600}
                mb={2}
                sx={{ color: "white" }}
              >
                {title}
              </Typography>
              <Stack spacing={1}>
                {links.map((link, index) => (
                  <Link
                    key={index}
                    component="button"
                    onClick={() => navigate(link.path)}
                    sx={{
                      color: "grey.300",
                      textDecoration: "none",
                      textAlign: "left",
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      fontSize: "0.875rem",
                      "&:hover": {
                        color: "primary.light",
                      },
                      transition: "color 0.3s ease",
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ my: 4, borderColor: "grey.800" }} />

        {/* Bottom Section */}
        <Box>
          <Typography
            variant="body2"
            color="grey.400"
            textAlign={{ xs: "center", md: "center", lg: "center" }}
          >
            Copyright © 2025 EduHikerz - Al Hussein Technical University. All
            Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
