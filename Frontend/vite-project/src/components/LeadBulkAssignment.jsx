import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Users, Check } from "lucide-react";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:8000/api";

const LeadBulkAssignment = ({ uploadedLeads = null, onAssignmentComplete }) => {
  const [leadCount, setLeadCount] = useState(0);
  const [selectedTelecallerCount, setSelectedTelecallerCount] = useState("");
  const [availableTelecallers, setAvailableTelecallers] = useState([]);
  const [selectedTelecallers, setSelectedTelecallers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [uploadedLeadsLocal, setUploadedLeadsLocal] = useState(null);

  const authHeader = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  };

  // Fetch available telecallers
  useEffect(() => {
    const fetchTelecallers = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${BASE_URL}/employees?role=Telecaller&status=active`,
          {
            method: "GET",
            headers: authHeader,
          },
        );

        if (!res.ok) throw new Error("Failed to fetch telecallers");

        const data = await res.json();
        // Ensure only Telecaller role users are used (defensive filter)
        const onlyTelecallers = (data.data || []).filter(
          (u) => String(u.role).toLowerCase() === "telecaller",
        );
        setAvailableTelecallers(onlyTelecallers);
      } catch (err) {
        toast.error(err.message || "Failed to load telecallers");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTelecallers();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("leadBulkUploadResult");
    if (stored) {
      try {
        setUploadedLeadsLocal(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to parse stored upload result", err);
      }
    }
  }, []);

  // Update lead count when uploaded leads change
  useEffect(() => {
    const updateSource = uploadedLeads || uploadedLeadsLocal;
    if (updateSource) {
      setTotalRows(
        updateSource.totalRows ||
          updateSource.imported ||
          updateSource.length ||
          0,
      );
      setLeadCount(updateSource.imported || updateSource.length || 0);
    }
  }, [uploadedLeads, uploadedLeadsLocal]);

  const getEqualDistribution = (totalLeads, telecallerCount) => {
    if (telecallerCount <= 0) return [];
    const base = Math.floor(totalLeads / telecallerCount);
    const remainder = totalLeads % telecallerCount;
    return Array.from({ length: telecallerCount }, (_, index) =>
      index < remainder ? base + 1 : base,
    );
  };

  // Handle telecaller count selection
  const handleTelecallerCountChange = (value) => {
    setSelectedTelecallerCount(value);
    setSelectedTelecallers([]); // Reset selected telecallers
  };

  // Handle individual telecaller selection
  const handleTelecallerToggle = (telecaller) => {
    const count = parseInt(selectedTelecallerCount);
    setSelectedTelecallers((prev) => {
      const isSelected = prev.some((t) => t._id === telecaller._id);
      if (isSelected) {
        return prev.filter((t) => t._id !== telecaller._id);
      } else if (prev.length < count) {
        return [...prev, telecaller];
      }
      return prev;
    });
  };

  // Handle assignment
  const handleAssign = async () => {
    if (!selectedTelecallers.length) {
      toast.error("Please select at least one telecaller");
      return;
    }

    setShowConfirmDialog(false);

    try {
      setAssigning(true);
      const uploadSource = uploadedLeads || uploadedLeadsLocal || {};
      const res = await fetch(`${BASE_URL}/leads/assign-manual`, {
        method: "POST",
        headers: authHeader,
        body: JSON.stringify({
          leadIds: uploadSource.leadIds || [],
          telecallerIds: selectedTelecallers.map((t) => t._id),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Assignment failed");
      }

      const data = await res.json();
      toast.success(`✅ ${data.assigned} leads assigned successfully!`);

      // Reset state
      setSelectedTelecallerCount("");
      setSelectedTelecallers([]);
      setLeadCount(0);

      if (onAssignmentComplete) {
        onAssignmentComplete(data);
      }
      localStorage.removeItem("leadBulkUploadResult");
    } catch (err) {
      toast.error(err.message || "Failed to assign leads");
      console.error(err);
    } finally {
      setAssigning(false);
    }
  };

  const leadsPerTelecaller =
    selectedTelecallers.length > 0
      ? Math.ceil(leadCount / selectedTelecallers.length)
      : 0;

  const telecallerCountNum = parseInt(selectedTelecallerCount) || 0;
  const distribution = getEqualDistribution(
    leadCount,
    selectedTelecallers.length,
  );

  return (
    <div className="space-y-6">
      {/* Lead Count Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Uploaded Leads Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-2">
                Total records in sheet
              </p>
              <p className="text-4xl font-bold text-blue-600">{totalRows}</p>
              <p className="text-sm text-slate-500 mt-2">
                {totalRows !== leadCount
                  ? `${leadCount} valid leads ready for manual assignment`
                  : `Ready for distribution to telecallers`}
              </p>
            </div>
            {totalRows !== leadCount && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <p>
                  Imported leads: <strong>{leadCount}</strong>
                </p>
                <p>
                  Skipped or invalid rows:{" "}
                  <strong>{totalRows - leadCount}</strong>
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Telecaller Selection Card */}
      <Card>
        <CardHeader>
          <CardTitle>Distribute Leads to Telecallers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Select Count */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Step 1: How many telecallers?
            </label>
            <Select
              value={selectedTelecallerCount}
              onValueChange={handleTelecallerCountChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select number of telecallers" />
              </SelectTrigger>
              <SelectContent>
                {Array.from(
                  { length: Math.min(10, availableTelecallers.length) },
                  (_, i) => i + 1,
                ).map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} Telecaller{num > 1 ? "s" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Step 2: Select Telecallers */}
          {telecallerCountNum > 0 && (
            <div className="space-y-3 border-t pt-6">
              <label className="text-sm font-medium">
                Step 2: Select {telecallerCountNum} telecaller
                {telecallerCountNum > 1 ? "s" : ""}
              </label>
              <p className="text-xs text-slate-500">
                Estimated equal distribution:{" "}
                {distribution.length > 0 ? distribution[0] : 0} -{" "}
                {distribution[distribution.length - 1] || 0} leads each
              </p>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                ) : availableTelecallers.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No active telecallers available
                  </p>
                ) : (
                  availableTelecallers.map((telecaller) => (
                    <div
                      key={telecaller._id}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer"
                      onClick={() => handleTelecallerToggle(telecaller)}
                    >
                      <Checkbox
                        checked={selectedTelecallers.some(
                          (t) => t._id === telecaller._id,
                        )}
                        onChange={() => handleTelecallerToggle(telecaller)}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{telecaller.name}</p>
                        <p className="text-xs text-slate-500">
                          {telecaller.email}
                        </p>
                      </div>
                      {selectedTelecallers.some(
                        (t) => t._id === telecaller._id,
                      ) && (
                        <Badge variant="default" className="ml-auto">
                          <Check className="h-3 w-3 mr-1" /> Selected
                        </Badge>
                      )}
                    </div>
                  ))
                )}
              </div>

              {selectedTelecallers.length === telecallerCountNum && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                  <p className="font-medium text-sm text-green-900">
                    ✓ Distribution Preview
                  </p>
                  {selectedTelecallers.map((telecaller, idx) => (
                    <div
                      key={telecaller._id}
                      className="text-sm text-green-800"
                    >
                      <span className="font-medium">{telecaller.name}:</span>{" "}
                      {distribution[idx] || 0} leads
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Assignment Button */}
          {selectedTelecallers.length === telecallerCountNum &&
            telecallerCountNum > 0 && (
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowConfirmDialog(true)}
                  disabled={assigning}
                  className="flex-1 mt-4"
                  size="lg"
                >
                  {assigning && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Review & Submit
                </Button>
                <Button
                  onClick={handleAssign}
                  disabled={assigning}
                  className="flex-1 mt-4"
                  size="lg"
                >
                  {assigning && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Submit
                </Button>
              </div>
            )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Lead Assignment</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-3 mt-4">
                <p>
                  You are about to assign <strong>{leadCount} leads</strong> to{" "}
                  <strong>{selectedTelecallers.length} telecaller</strong>
                  {selectedTelecallers.length > 1 ? "s" : ""}.
                </p>
                <div className="bg-slate-50 rounded p-3 space-y-2">
                  {selectedTelecallers.map((t, idx) => (
                    <div key={t._id} className="text-sm">
                      • <strong>{t.name}</strong>: {distribution[idx] || 0}{" "}
                      leads
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-600">
                  This action cannot be undone immediately. Please review
                  carefully.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAssign} disabled={assigning}>
              {assigning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Assigning...
                </>
              ) : (
                "Confirm Assignment"
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LeadBulkAssignment;
