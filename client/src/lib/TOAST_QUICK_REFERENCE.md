# 🔥 Toast Quick Reference

## Import

```javascript
import { toast } from "@/lib/toast";
```

## Basic Usage

```javascript
toast.success("Success message"); // ✓ Green, 3s
toast.error("Error message"); // ✗ Red, 4s
toast.warning("Warning message"); // ⚠ Yellow, 3.5s
toast.info("Info message"); // ℹ Blue, 3s
```

## Custom Duration

```javascript
toast.success("Message", { duration: 5000 }); // 5 seconds
```

## Common Patterns

### API Success

```javascript
const response = await api.post();
toast.success("Data saved successfully!");
```

### API Error

```javascript
try {
  await api.delete();
} catch (error) {
  toast.error(error.message || "Failed to delete");
}
```

### Form Validation

```javascript
if (!isValid) {
  toast.warning("Please fill all required fields");
  return;
}
```

### Copy to Clipboard

```javascript
navigator.clipboard.writeText(text);
toast.info("Copied to clipboard!");
```

### RTK Query Pattern

```javascript
try {
  const result = await mutation(data).unwrap();
  toast.success("Saved successfully!");
} catch (error) {
  toast.error(error.data?.message || "Failed to save");
}
```

## When to Use Each Type

| Type    | Use For                                            |
| ------- | -------------------------------------------------- |
| Success | Action completed, data saved, successful ops       |
| Error   | API failures, validation errors, system errors     |
| Warning | Session expiring, unsaved changes, cautions        |
| Info    | General notifications, tips, feature announcements |

## Best Practices

### ✅ DO

- Keep messages short (< 60 characters)
- Use action words: "Saved", "Failed", "Updated"
- Include context: "Profile updated" not just "Updated"
- One toast per action

### ❌ DON'T

- Use vague messages: "Success!" or "Error"
- Write long paragraphs
- Spam multiple toasts in loops
- Use without context

## Examples

### Good ✓

```javascript
toast.success("Profile updated successfully!");
toast.error("Failed to connect to server");
toast.warning("Session expires in 5 minutes");
toast.info("New features are available");
```

### Bad ✗

```javascript
toast.success("Success!"); // Too vague
toast.error("Error"); // Not helpful
toast.info("Lorem ipsum..."); // Too long
```

---

**That's it! Simple, powerful, zero dependencies! 🎉**
