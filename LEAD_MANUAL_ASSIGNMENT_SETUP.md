# Lead Manual Assignment Feature - Complete Setup Guide

## Overview

This feature allows you to upload bulk leads WITHOUT automatically assigning them to telecallers. Instead, you can:

1. View the total count of uploaded leads
2. Select how many telecallers you want to distribute to
3. Select specific telecallers from a dropdown
4. Get a preview of how leads will be distributed equally
5. Confirm and assign all leads with equal distribution

## What's Changed

### Backend Changes

#### 1. **New API Endpoint: `/leads/bulk-upload-unassigned`**

- **Method**: POST
- **File Input**: `file` (CSV/XLSX/XLS)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Successfully imported X leads! Ready for manual assignment.",
    "imported": 100,
    "leadIds": ["id1", "id2", ...],
    "validLeads": 100,
    ...
  }
  ```
- **Location**: [Server/routes/leadRoutes.js](../../Server/routes/leadRoutes.js)

#### 2. **New API Endpoint: `/leads/assign-manual`**

- **Method**: POST
- **Body**:
  ```json
  {
    "leadIds": ["id1", "id2", ...],
    "telecallerIds": ["tel-id1", "tel-id2", ...]
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "assigned": 100,
    "distribution": [
      {
        "telecallerId": "...",
        "name": "Telecaller Name",
        "assignedLeads": 50
      }
    ]
  }
  ```
- **Location**: [Server/routes/leadRoutes.js](../../Server/routes/leadRoutes.js)

#### 3. **New Controller Functions**

- `bulkUploadLeadsWithoutAssignment`: Uploads leads without assigning them
- `assignLeadsManually`: Manually assigns leads to selected telecallers with equal distribution

**Location**: [Server/controller/leadController.js](../../Server/controller/leadController.js)

### Frontend Changes

#### 1. **New Component: `LeadBulkAssignment.jsx`**

This component provides:

- Lead count display from uploaded sheet
- Dropdown to select number of telecallers (1-10)
- Checkbox list to select specific telecallers
- Preview of lead distribution
- Confirmation dialog before assignment

**Location**: [Frontend/vite-project/src/components/LeadBulkAssignment.jsx](../../Frontend/vite-project/src/components/LeadBulkAssignment.jsx)

**Props**:

- `uploadedLeads`: Object containing `imported` count and `leadIds` array
- `onAssignmentComplete`: Callback function after successful assignment

## Integration Steps

### Step 1: Update your Lead Upload Page

In your [AddStudent.jsx](../../Frontend/vite-project/src/pages/Admin/AddStudent.jsx) or wherever you have the bulk upload form:

```jsx
import LeadBulkAssignment from "@/components/LeadBulkAssignment";

// In your component:
const [uploadedLeads, setUploadedLeads] = useState(null);

const handleUpload = async () => {
  if (!file) return toast.error("Please select a file");

  const formData = new FormData();
  formData.append("file", file);

  try {
    setUploading(true);
    // Use the NEW endpoint for unassigned upload
    const res = await axios.post(
      `${BASE_URL}/leads/bulk-upload-unassigned`, // Changed endpoint
      formData,
      authHeader,
    );

    setUploadedLeads({
      imported: res.data.imported,
      leadIds: res.data.leadIds,
    });

    setUploadMsg({
      type: "success",
      text: `✅ Imported ${res.data.imported} leads! Please assign them now.`,
    });
    clearFile();
  } catch (err) {
    setUploadMsg({
      type: "error",
      text: "❌ " + (err.response?.data?.message || "Upload failed"),
    });
  } finally {
    setUploading(false);
  }
};

// In your JSX:
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="leads">All Leads</TabsTrigger>
    <TabsTrigger value="upload">Bulk Upload</TabsTrigger>
    <TabsTrigger value="assignment">Assign Leads</TabsTrigger>
  </TabsList>

  {/* Upload Tab - Upload file here */}
  <TabsContent value="upload">{/* Your upload UI */}</TabsContent>

  {/* Assignment Tab - Assign uploaded leads */}
  <TabsContent value="assignment">
    {uploadedLeads ? (
      <LeadBulkAssignment
        uploadedLeads={uploadedLeads}
        onAssignmentComplete={() => {
          // Refresh leads or reset
          setUploadedLeads(null);
          reload();
        }}
      />
    ) : (
      <div className="p-6 text-center text-slate-500">
        Upload leads first to assign them
      </div>
    )}
  </TabsContent>
</Tabs>;
```

### Step 2: Keep Existing Bulk Upload (Optional)

If you want to keep the automatic assignment feature, the original `/leads/bulk-upload` endpoint still works. Just don't change it.

## Usage Flow

### For Admin Users:

1. **Navigate to Lead Management**
2. **Go to "Bulk Upload" tab**
   - Select a CSV/XLSX file
   - Click "Upload"
   - Leads are imported but NOT assigned yet
3. **Go to "Assign Leads" tab**
   - View total count of imported leads
   - Select number of telecallers (e.g., 3)
   - Select specific telecallers from the list
   - See distribution preview
   - Click "Assign X Leads to Y Telecallers"
   - Confirm assignment
4. **Leads are now equally distributed!**

## Feature Highlights

✅ **No Automatic Assignment** - Full control over who gets the leads
✅ **Equal Distribution** - Leads are divided equally among selected telecallers
✅ **Visual Preview** - See exactly how leads will be distributed before confirming
✅ **Multiple Telecallers** - Support for 1-10 telecallers selection
✅ **Confirmation Dialog** - Prevent accidental assignments
✅ **Toast Notifications** - Real-time feedback on actions

## Example Distribution

- **Total Leads**: 100
- **Selected Telecallers**: 3 (Raj, Priya, Amit)
- **Distribution**:
  - Raj: 34 leads
  - Priya: 33 leads
  - Amit: 33 leads

The distribution uses round-robin to ensure equal or nearly equal distribution.

## Database Impact

- Leads are created with `status: "New"` and `leadTag: "Warm"`
- `assignedToTelecaller` field is set after manual assignment
- No other fields are modified

## Troubleshooting

### "No active telecallers available"

- Check if telecallers exist in the Employee database
- Ensure their status is set to "active"

### "Failed to fetch telecallers"

- Check if `/employees?role=Telecaller&status=active` endpoint is working
- Verify authorization token

### Leads not showing up

- Check if leads were successfully uploaded (check database)
- Verify lead IDs are being returned from upload endpoint

## Files Modified

1. ✅ [Server/routes/leadRoutes.js](../../Server/routes/leadRoutes.js) - Added new routes
2. ✅ [Server/controller/leadController.js](../../Server/controller/leadController.js) - Added new functions
3. ✅ [Frontend/vite-project/src/components/LeadBulkAssignment.jsx](../../Frontend/vite-project/src/components/LeadBulkAssignment.jsx) - New component (created)

## Files To Update

- [Frontend/vite-project/src/pages/Admin/AddStudent.jsx](../../Frontend/vite-project/src/pages/Admin/AddStudent.jsx) - Integrate the new component

## API Endpoint Comparison

| Feature           | Old Endpoint         | New Endpoint                                             |
| ----------------- | -------------------- | -------------------------------------------------------- |
| Auto Assignment   | `/leads/bulk-upload` | -                                                        |
| Manual Assignment | -                    | `/leads/bulk-upload-unassigned` + `/leads/assign-manual` |

Both endpoints can coexist. Choose which one to use based on your needs.

---

**Created on**: May 21, 2026
**Version**: 1.0
