"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Button,
  MenuItem,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Avatar,
  IconButton,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";

const companyTypes = ["startup", "mnc", "psu", "private", "ngo", "other"];
const contactTypes = ["head_hr", "poc1", "poc2"];
const contactLabels: Record<string, string> = {
  head_hr: "Head HR",
  poc1: "Point of Contact 1",
  poc2: "Point of Contact 2",
};

const emptyContact = (type: string) => ({
  contact_type: type,
  contact_name: "",
  designation: "",
  email: "",
  phone: "",
  landline: "",
});

export default function CompanyProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [extracting, setExtracting] = useState(false);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [companyFile, setCompanyFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    company_name: "",
    website: "",
    industry: "",
    company_type: "",
    about_company: "",
    headquarters_address: "",
    city: "",
    state: "",
    country: "India",
    postal_code: "",
    linkedin_url: "",
    annual_turnover: "",
    no_of_employees: "",
    mnc_hq_country: "",
    mnc_hq_city: "",
  });

  const [contacts, setContacts] = useState(
    contactTypes.map((t) => emptyContact(t)),
  );

  const [industryTags, setIndustryTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status]);

  useEffect(() => {
    if (status !== "authenticated") return;
    api
      .get("/company")
      .then((res) => {
        const c = res.data.company;
        setForm({
          company_name: c.company_name ?? "",
          website: c.website ?? "",
          industry: c.industry ?? "",
          company_type: c.company_type ?? "",
          about_company: c.about_company ?? "",
          headquarters_address: c.headquarters_address ?? "",
          city: c.city ?? "",
          state: c.state ?? "",
          country: c.country ?? "India",
          postal_code: c.postal_code ?? "",
          linkedin_url: c.linkedin_url ?? "",
          annual_turnover: c.annual_turnover ?? "",
          no_of_employees: c.no_of_employees ?? "",
          mnc_hq_country: c.mnc_hq_country ?? "",
          mnc_hq_city: c.mnc_hq_city ?? "",
        });
        if (c.logo_path) {
          const base = (
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
          ).replace(/\/api\/?$/, "");
          setLogoPreview(`${base}/storage/${c.logo_path}?t=${Date.now()}`);
        }
        setIndustryTags(c.industry_tags ?? []);
        if (c.contacts?.length) {
          const merged = contactTypes.map((type) => {
            const found = c.contacts.find((x: any) => x.contact_type === type);
            if (found) {
              return {
                contact_type: found.contact_type ?? "",
                contact_name: found.contact_name ?? "",
                designation: found.designation ?? "",
                email: found.email ?? "",
                phone: found.phone ?? "",
                landline: found.landline ?? "",
              };
            }
            return emptyContact(type);
          });
          setContacts(merged);
        }
        setIsNew(false);
      })
      .catch(() => setIsNew(true))
      .finally(() => setLoading(false));
  }, [status]);

  const setField = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const setContact = (i: number, k: string, v: string) =>
    setContacts((prev) =>
      prev.map((c, idx) => (idx === i ? { ...c, [k]: v } : c)),
    );

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !industryTags.includes(tag)) {
      setIndustryTags((t) => [...t, tag]);
      setTagInput("");
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      industryTags.forEach((tag, i) =>
        formData.append(`industry_tags[${i}]`, tag),
      );
      contacts.forEach((contact, i) => {
        Object.entries(contact).forEach(([k, v]) =>
          formData.append(`contacts[${i}][${k}]`, v),
        );
      });
      if (logoFile) formData.append("logo", logoFile);
      if (companyFile) formData.append("company_file", companyFile);

      const baseUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      ).replace(/\/api\/?$/, "");
      if (isNew) {
        const res = await api.post("/company", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setIsNew(false);
        setSuccess("Company profile created successfully!");
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (res.data?.company?.logo_path) {
          setLogoPreview(
            `${baseUrl}/storage/${res.data.company.logo_path}?t=${Date.now()}`,
          );
          setLogoFile(null);
        }
      } else {
        const res = await api.post("/company/update", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Company profile updated successfully!");
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (res.data?.company?.logo_path) {
          setLogoPreview(
            `${baseUrl}/storage/${res.data.company.logo_path}?t=${Date.now()}`,
          );
          setLogoFile(null);
        }
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to save. Check all required fields.",
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
      if (success || error) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
      setLogoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleAutofill = async () => {
    if (!companyFile) return;
    setExtracting(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", companyFile);
      formData.append("type", "company");
      const res = await api.post("/extract-pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = res.data.data;
      if (data) {
        setForm((prev) => ({
          ...prev,
          company_name: data.company_name || prev.company_name,
          website: data.website || prev.website,
          industry: data.industry || prev.industry,
          company_type: data.company_type || prev.company_type,
          about_company: data.about_company || prev.about_company,
          headquarters_address:
            data.headquarters_address || prev.headquarters_address,
          city: data.city || prev.city,
          state: data.state || prev.state,
          country: data.country || prev.country,
          postal_code: data.postal_code || prev.postal_code,
          no_of_employees: data.no_of_employees || prev.no_of_employees,
          annual_turnover: data.annual_turnover || prev.annual_turnover,
        }));
        setSuccess(
          "Successfully extracted details from the PDF. Please review the autofilled data carefully to ensure accuracy.",
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "PDF extraction failed");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setExtracting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#660000" }}>
          Company Profile
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isNew
            ? "Complete your company profile to start posting JNFs and INFs."
            : "Update your company details here."}
        </Typography>
      </Box>

      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{
            mb: 3,
            borderRadius: "12px",
            boxShadow: "0 2px 12px rgba(211, 47, 47, 0.1)",
            "& .MuiAlert-message": { fontWeight: 500 },
          }}
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          severity="success"
          onClose={() => setSuccess("")}
          sx={{
            mb: 3,
            borderRadius: "12px",
            boxShadow: "0 2px 12px rgba(46, 125, 50, 0.1)",
            "& .MuiAlert-message": { fontWeight: 500 },
          }}
        >
          {success}
        </Alert>
      )}

      {/* Basic Info */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 3, color: "#660000" }}
          >
            Basic Information
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
            <Avatar
              src={logoPreview}
              sx={{ width: 80, height: 80, border: "2px solid #ccc" }}
            />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<PhotoCamera />}
                size="small"
              >
                Upload Logo
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleLogoChange}
                />
              </Button>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textAlign: "center" }}
              >
                Max size: 2MB
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadFileIcon />}
                size="small"
                color={companyFile ? "success" : "primary"}
              >
                {companyFile ? "File Selected" : "Upload Company Profile (PDF)"}
                <input
                  hidden
                  accept="application/pdf"
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0])
                      setCompanyFile(e.target.files[0]);
                  }}
                />
              </Button>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textAlign: "center" }}
              >
                Max size: 5MB
              </Typography>
            </Box>
            {companyFile && (
              <Button
                variant="contained"
                size="small"
                color="secondary"
                onClick={handleAutofill}
                disabled={extracting}
                sx={{
                  background: "#C8922A",
                  "&:hover": { background: "#A0721A" },
                }}
              >
                {extracting ? "Extracting..." : "Autofill from File"}
              </Button>
            )}
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Company Name"
                value={form.company_name}
                onChange={(e) => setField("company_name", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Website"
                value={form.website}
                onChange={(e) => setField("website", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Industry"
                value={form.industry}
                onChange={(e) => setField("industry", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Company Type"
                value={form.company_type}
                onChange={(e) => setField("company_type", e.target.value)}
              >
                {companyTypes.map((t) => (
                  <MenuItem
                    key={t}
                    value={t}
                    sx={{ textTransform: "capitalize" }}
                  >
                    {t.toUpperCase()}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="About Company"
                value={form.about_company}
                onChange={(e) => setField("about_company", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="LinkedIn URL"
                value={form.linkedin_url}
                onChange={(e) => setField("linkedin_url", e.target.value)}
              />
            </Grid>
            {/* Industry Tags */}
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Industry Tags
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
                <TextField
                  size="small"
                  label="Add tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                  sx={{ flex: 1 }}
                />
                <Button variant="outlined" onClick={addTag}>
                  Add
                </Button>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {industryTags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    onDelete={() =>
                      setIndustryTags((t) => t.filter((x) => x !== tag))
                    }
                    sx={{ background: "rgba(0,51,102,0.08)", color: "#660000" }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Address */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 3, color: "#660000" }}
          >
            Address & Size
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Headquarters Address"
                value={form.headquarters_address}
                onChange={(e) =>
                  setField("headquarters_address", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="City"
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="State"
                value={form.state}
                onChange={(e) => setField("state", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Country"
                value={form.country}
                onChange={(e) => setField("country", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Postal Code"
                value={form.postal_code}
                onChange={(e) => setField("postal_code", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="No. of Employees (e.g. 500-1000)"
                value={form.no_of_employees}
                onChange={(e) => setField("no_of_employees", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Annual Turnover"
                value={form.annual_turnover}
                onChange={(e) => setField("annual_turnover", e.target.value)}
              />
            </Grid>
            {form.company_type === "mnc" && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="MNC HQ Country"
                    value={form.mnc_hq_country}
                    onChange={(e) => setField("mnc_hq_country", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="MNC HQ City"
                    value={form.mnc_hq_city}
                    onChange={(e) => setField("mnc_hq_city", e.target.value)}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Contacts */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 3, color: "#660000" }}
          >
            Contact Persons
          </Typography>
          {contacts.map((contact, i) => (
            <Box key={contact.contact_type}>
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, mb: 2, color: "#C8922A" }}
              >
                {contactLabels[contact.contact_type]}
                {i === 0 && " *"}
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Full Name"
                    required={i === 0}
                    value={contact.contact_name}
                    onChange={(e) =>
                      setContact(i, "contact_name", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Designation"
                    value={contact.designation}
                    onChange={(e) =>
                      setContact(i, "designation", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Email"
                    required={i === 0}
                    value={contact.email}
                    onChange={(e) => setContact(i, "email", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Mobile"
                    value={contact.phone}
                    onChange={(e) => setContact(i, "phone", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Landline"
                    value={contact.landline}
                    onChange={(e) => setContact(i, "landline", e.target.value)}
                  />
                </Grid>
              </Grid>
              {i < contacts.length - 1 && <Divider sx={{ mb: 3 }} />}
            </Box>
          ))}
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={saving}
          sx={{ px: 5 }}
        >
          {saving ? (
            <CircularProgress size={22} color="inherit" />
          ) : isNew ? (
            "Create Company Profile"
          ) : (
            "Update Profile"
          )}
        </Button>
      </Box>
    </DashboardLayout>
  );
}
