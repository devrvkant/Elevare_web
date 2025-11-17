import { toast } from "@/lib/toast";

toast.success("Success message"); // ✓ Green, 3s
toast.error("Error message"); // ✗ Red, 4s
toast.warning("Warning message"); // ⚠ Yellow, 3.5s
toast.info("Info message"); // ℹ Blue, 3s

toast.success("Message", { duration: 5000 }); // 5 seconds
toast.error("Message", { duration: 10000 }); // 10 seconds

// API Success
const response = await api.post();
toast.success("Data saved successfully!");

// API Error
try {
  await api.delete();
} catch (error) {
  toast.error(error.message || "Failed to delete");
}

// Form Validation
if (!isValid) {
  toast.warning("Please fill all required fields");
  return;
}

// Copy to Clipboard
navigator.clipboard.writeText(text);
toast.info("Copied to clipboard!");

// Loading Complete
await loadData();
toast.success("Data loaded!");

// User Action Confirmation
await deleteItem();
toast.success("Item deleted successfully!");

const handleAction = async () => {
  try {
    await someAsyncOperation();
    toast.success("Operation completed!");
  } catch (error) {
    toast.error("Operation failed!");
  }
};

const [mutation] = useMutation();

try {
  const result = await mutation(data).unwrap();
  toast.success("Saved successfully!");
} catch (error) {
  toast.error(error.data?.message || "Failed to save");
}
