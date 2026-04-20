"use client";
import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { STD_CODES } from "@/constants/countries";

export default function AlumniMentorPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    std_code: "+91",
    phone: "",
    graduation_year: "",
    branch: "",
    company: "",
    designation: "",
    linkedin: "",
    years_of_experience: "",
    preferred_mode: "Online",
    max_mentees: "1",
    expertise: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Temporarily bypass authentication header just for this public route if needed
      const res = await api.post("/alumni-mentor", formData);
      if (res.data.success) {
        setSuccess(true);
        setPdfUrl(res.data.pdf_url);
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to submit application. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#F5F5F5",
        p: 3,
        py: 8,
      }}
    >
      <Card sx={{ maxWidth: 800, width: "100%", borderRadius: 3, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", position: "relative" }}>
        
        <IconButton 
          onClick={() => router.push("/auth/login")} 
          sx={{ position: "absolute", top: 16, left: 16, color: "#660000", bgcolor: "rgba(102,0,0,0.05)", "&:hover": { bgcolor: "rgba(102,0,0,0.1)" } }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Box sx={{ bgcolor: "white", p: 4, textAlign: "center", borderBottom: "1px solid #E0E0E0" }}>
          <SchoolIcon sx={{ fontSize: 48, color: "#660000", mb: 1 }} />
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#660000", letterSpacing: -0.5 }}>
            Alumni Mentorship Program
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5, maxWidth: 640, mx: "auto", fontWeight: 500, lineHeight: 1.6 }}>
            Empower the next generation of professionals by sharing your experience. 
            Once you submit your application, a formalized PDF summary will be generated and shared with the CDC administration for review.
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {success ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Alert severity="success" sx={{ mb: 4, textAlign: "left", borderRadius: 2 }}>
                Thank you! Your mentorship application has been submitted successfully. The CDC Admin has been notified.
              </Alert>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Review Your Submitted Details
              </Typography>
              {pdfUrl && (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PictureAsPdfIcon />}
                  href={pdfUrl}
                  target="_blank"
                  download
                  sx={{
                    bgcolor: "#e53935",
                    "&:hover": { bgcolor: "#7A0000" },
                    borderRadius: 2,
                    px: 4,
                  }}
                >
                  Download Application PDF
                </Button>
              )}
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="email"
                    label="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={4} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel>STD</InputLabel>
                    <Select
                      name="std_code"
                      value={formData.std_code}
                      label="STD"
                      onChange={handleChange as any}
                    >
                      {STD_CODES.map((item) => (
                        <MenuItem key={item.code + item.country} value={item.code}>
                          {item.code} ({item.country})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={8} sm={9}>
                  <TextField
                    fullWidth
                    type="tel"
                    label="Mobile Number (Optional)"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Graduation Year (e.g., 2015)"
                    name="graduation_year"
                    value={formData.graduation_year}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Branch / Degree"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Current Company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Designation / Role"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Years of Experience"
                    name="years_of_experience"
                    value={formData.years_of_experience}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth required>
                    <InputLabel>Preferred Mode</InputLabel>
                    <Select
                      name="preferred_mode"
                      value={formData.preferred_mode}
                      label="Preferred Mode"
                      onChange={handleChange as any}
                    >
                      <MenuItem value="Online">Online</MenuItem>
                      <MenuItem value="In-person">In-person</MenuItem>
                      <MenuItem value="Both">Both (Hybrid)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Max Mentees capacity"
                    name="max_mentees"
                    value={formData.max_mentees}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="LinkedIn Profile URL"
                    name="linkedin"
                    type="url"
                    value={formData.linkedin}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Area of Expertise / Preferred Mentorship Topics"
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleChange}
                    required
                    helperText="What subjects or career paths can you help students with?"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => window.history.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: "#660000",
                    "&:hover": { bgcolor: "#7F0000" },
                    px: 6,
                  }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Submit Application"}
                </Button>
              </Box>
            </form>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
