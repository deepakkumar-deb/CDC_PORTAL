"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  StepIconProps,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { styled } from "@mui/material/styles";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import InternProfileTab from "@/components/inf/InternProfileTab";
import EligibilityTab from "@/components/jnf/EligibilityTab";
import StipendTab from "@/components/inf/StipendTab";
import SelectionTab from "@/components/jnf/SelectionTab";
import DeclarationTab from "@/components/jnf/DeclarationTab";

const tabs = [
  "Intern Profile",
  "Eligibility",
  "Stipend",
  "Selection Process",
  "Declaration & Submit",
];

// Custom Stepper Styling
const ColorlibConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: "#008080", // Teal
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: "#008080", // Teal
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#ccc",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ ownerState }) => ({
  backgroundColor: "#fff",
  zIndex: 1,
  color: "#ccc",
  width: 45,
  height: 45,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  fontWeight: "bold",
  fontSize: "1.2rem",
  border: "3px solid #ccc",
  ...(ownerState.active && {
    backgroundColor: "#d32f2f", // Red
    color: "#fff",
    border: "none",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    color: "#008080", // Teal
    border: "3px solid #008080",
    backgroundColor: "#fff",
  }),
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className, icon } = props;
  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icon}
    </ColorlibStepIconRoot>
  );
}

export default function NewInfPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [jnfId, setJnfId] = useState<number | null>(null);
  const [infCode, setInfCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [initialized, setInit] = useState(false);
  const [existingData, setExistingData] = useState<any>(null);
  const [extracting, setExtracting] = useState(false);
  useEffect(() => {
    // Lazy creation: don't call backend until first save
    setInit(true);
  }, []);

  const handleTabSave = async (
    tabIndex: number,
    data: any,
    endpoint: string,
  ) => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      let currentId = jnfId;

      // If no ID yet (fresh form), create it now
      if (!currentId) {
        const res = await api.post("/inf");
        currentId = res.data.jnf_id;
        setJnfId(currentId);
        setInfCode(res.data.inf_code);
      }

      await api.post(`/inf/${currentId}/${endpoint}`, data);

      setExistingData((prev: any) => ({
        ...(prev || {}),
        ...data,
      }));

      setSuccess("Saved successfully.");
      if (tabIndex < tabs.length - 1) setActiveTab(tabIndex + 1);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!jnfId) return;
    setSaving(true);
    try {
      await api.post(`/inf/${jnfId}/submit`);
      setSuccess("INF submitted! CDC will review it shortly.");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Submission failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleAutofillPdf = async (file: File) => {
    if (!file) return;
    setExtracting(true);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "inf");
      const res = await api.post("/extract-pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const AI = res.data.data;
      if (AI) {
        const programmes = ["btech_dual", "mtech", "mba", "msc", "phd"];
        setExistingData((prev: any) => ({
          ...(prev || {}),
          internship_title: AI.internship_title,
          job_description: AI.job_description,
          location_type: AI.location_type,
          openings_count: AI.openings_count,
          skills: AI.skills
            ? AI.skills.map((s: string) => ({ skill_name: s }))
            : [],
          inf_stipend_breakdowns: AI.stipend
            ? programmes.map((p) => ({
                programme_type: p,
                currency: "INR",
                base_stipend: AI.stipend.monthly_stipend || "",
                hra_housing: "",
                variable_pay: "",
                other_allowance: "",
                total_stipend: AI.stipend.monthly_stipend || "",
              }))
            : [],
          inf_compensation_perks: [],
          ppo_offered: AI.stipend?.ppo_offered || false,
          ppo_ctc_expected: "",
          accommodation_provided: AI.stipend?.accommodation_provided || false,
          eligibility_rule: AI.eligibility_rule
            ? {
                min_cgpa: AI.eligibility_rule.min_cgpa,
                max_backlogs_allowed: AI.eligibility_rule.max_backlogs_allowed,
                min_class_10_percent: AI.eligibility_rule.min_class_10_percent,
                min_class_12_percent: AI.eligibility_rule.min_class_12_percent,
              }
            : undefined,
          selection_rounds: AI.selection_process?.rounds,
          selection_infrastructure: AI.selection_process?.infrastructure
            ? {
                rooms_required:
                  AI.selection_process.infrastructure.rooms_required,
                team_members_required:
                  AI.selection_process.infrastructure.team_members_required,
                other_screening:
                  AI.selection_process.infrastructure.other_screening,
              }
            : undefined,
        }));
        setSuccess(
          "Successfully extracted details from the PDF. Please review the autofilled data carefully to ensure accuracy before submitting.",
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to extract data.");
    } finally {
      setExtracting(false);
    }
  };

  return (
    <DashboardLayout>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#003366" }}>
            New Intern Notification Form
          </Typography>
          {infCode && (
            <Typography variant="caption" color="text.secondary">
              Form Code: {infCode}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            component="label"
            variant="contained"
            color="secondary"
            startIcon={<UploadFileIcon />}
            size="small"
            disabled={extracting}
            sx={{ background: "#C8922A", "&:hover": { background: "#A0721A" } }}
          >
            {extracting ? "Extracting..." : "Autofill from PDF"}
            <input
              hidden
              accept="application/pdf"
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0])
                  handleAutofillPdf(e.target.files[0]);
              }}
            />
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => router.push("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      <Card>
        <Box
          sx={{
            p: 4,
            pb: 6,
            borderBottom: "2px solid",
            borderColor: "#e0e0e0",
            background: "#FAFAFA",
          }}
        >
          <Stepper
            alternativeLabel
            activeStep={activeTab}
            connector={<ColorlibConnector />}
          >
            {tabs.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          {!initialized ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {activeTab === 0 && (
                <InternProfileTab
                  saving={saving}
                  initialData={existingData}
                  onSave={(d) => handleTabSave(0, d, "intern-profile")}
                  onBack={() => router.push("/dashboard")}
                />
              )}
              {activeTab === 1 && (
                <EligibilityTab
                  saving={saving}
                  initialData={existingData}
                  onSave={(d) => handleTabSave(1, d, "eligibility")}
                  onBack={() => setActiveTab(0)}
                />
              )}
              {activeTab === 2 && (
                <StipendTab
                  saving={saving}
                  initialData={existingData}
                  onSave={(d) => handleTabSave(2, d, "stipend")}
                  onBack={() => setActiveTab(1)}
                />
              )}
              {activeTab === 3 && (
                <SelectionTab
                  saving={saving}
                  initialData={existingData}
                  onSave={(d) => handleTabSave(3, d, "selection")}
                  onBack={() => setActiveTab(2)}
                />
              )}
              {activeTab === 4 && (
                <DeclarationTab
                  saving={saving}
                  onSubmit={handleSubmit}
                  onBack={() => setActiveTab(3)}
                  formData={existingData}
                  onSave={jnfId
                    ? () => api.get(`/inf/${jnfId}`).then(r => setExistingData(r.data.inf))
                    : undefined
                  }
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
