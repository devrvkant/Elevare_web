# Custom Toast Notification System

A lightweight, zero-dependency toast notification system built from scratch.

## Features

- ✨ No external dependencies
- 🎨 Beautiful, animated notifications
- 🎯 4 types: success, error, warning, info
- ⏱️ Auto-dismiss with customizable duration
- 🎭 Smooth slide-in/slide-out animations
- 🎨 Color-coded with icons
- 📱 Responsive and accessible
- ❌ Manual close option

## Setup

The ToastContainer is already added to `App.jsx`, so you're ready to use it anywhere in your app!

## Usage

### Basic Usage

```jsx
import { toast } from "@/lib/toast";

// Success notification
toast.success("Profile updated successfully!");

// Error notification
toast.error("Failed to save changes");

// Warning notification
toast.warning("Your session will expire soon");

// Info notification
toast.info("New features are available");
```

### With Custom Duration

```jsx
// Show toast for 5 seconds
toast.success("Operation completed!", { duration: 5000 });

// Show error for 10 seconds
toast.error("Critical error occurred", { duration: 10000 });
```

## Examples

### Form Submission

```jsx
const handleSubmit = async (data) => {
  try {
    await submitForm(data);
    toast.success("Form submitted successfully!");
  } catch (error) {
    toast.error(error.message || "Failed to submit form");
  }
};
```

### API Requests

```jsx
const fetchData = async () => {
  try {
    const response = await api.getData();
    toast.success("Data loaded successfully!");
    return response;
  } catch (error) {
    toast.error("Failed to fetch data. Please try again.");
    throw error;
  }
};
```

### User Actions

```jsx
const handleDelete = async (id) => {
  try {
    await deleteItem(id);
    toast.success("Item deleted successfully!");
  } catch (error) {
    toast.error("Failed to delete item");
  }
};

const handleCopy = () => {
  navigator.clipboard.writeText(text);
  toast.info("Copied to clipboard!");
};

const handleSave = async () => {
  if (!isValid) {
    toast.warning("Please fill all required fields");
    return;
  }

  try {
    await save();
    toast.success("Saved successfully!");
  } catch (error) {
    toast.error("Failed to save");
  }
};
```

## API Reference

### toast.success(message, options)

Shows a success notification with a green color scheme and checkmark icon.

### toast.error(message, options)

Shows an error notification with a red color scheme and X icon.

### toast.warning(message, options)

Shows a warning notification with a yellow color scheme and alert icon.

### toast.info(message, options)

Shows an info notification with a blue color scheme and info icon.

### Options

- `duration` (number): Duration in milliseconds before auto-dismiss. Default: 3000 (success/info), 3500 (warning), 4000 (error)

## Styling

The toast notifications use Tailwind CSS and are positioned at the top-right of the screen. They feature:

- Smooth slide-in animation from the right
- Backdrop blur effect
- Auto-stacking for multiple toasts
- Manual close button
- Responsive design

## Architecture

The system consists of three main parts:

1. **ToastManager** (`/lib/toast.js`): Event-based notification manager using the pub-sub pattern
2. **ToastContainer** (`/components/ui/Toast.jsx`): React component that renders and manages toast notifications
3. **App Integration** (`App.jsx`): Container added at the root level

The system uses a simple event emitter pattern, making it framework-agnostic at its core while providing a React wrapper for easy integration.
