import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

/**
 * Toast Demo Component
 *
 * This component demonstrates all the toast notification types.
 * You can import this into any page to test the toast system.
 *
 * Usage:
 * import ToastDemo from "@/components/demo/ToastDemo";
 *
 * Then render: <ToastDemo />
 */
export default function ToastDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-violet-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-8 shadow-xl border border-purple-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Toast Notification Demo
          </h1>
          <p className="text-gray-600">
            Click the buttons below to test different toast types
          </p>
        </div>

        <div className="space-y-4">
          {/* Success Toast */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">
              Success Toast
            </h3>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() =>
                  toast.success("Operation completed successfully!")
                }
                className="bg-green-600 hover:bg-green-700"
              >
                Show Success
              </Button>
              <Button
                onClick={() =>
                  toast.success("Profile updated! Changes saved.", {
                    duration: 5000,
                  })
                }
                variant="outline"
                className="border-green-600 text-green-700 hover:bg-green-50"
              >
                Success (5s)
              </Button>
            </div>
          </div>

          {/* Error Toast */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">Error Toast</h3>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => toast.error("Failed to complete the operation")}
                className="bg-red-600 hover:bg-red-700"
              >
                Show Error
              </Button>
              <Button
                onClick={() =>
                  toast.error("Connection timeout. Please try again later.", {
                    duration: 6000,
                  })
                }
                variant="outline"
                className="border-red-600 text-red-700 hover:bg-red-50"
              >
                Error (6s)
              </Button>
            </div>
          </div>

          {/* Warning Toast */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">
              Warning Toast
            </h3>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() =>
                  toast.warning("Your session will expire in 5 minutes")
                }
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Show Warning
              </Button>
              <Button
                onClick={() =>
                  toast.warning("Please save your work before leaving", {
                    duration: 4500,
                  })
                }
                variant="outline"
                className="border-yellow-600 text-yellow-700 hover:bg-yellow-50"
              >
                Warning (4.5s)
              </Button>
            </div>
          </div>

          {/* Info Toast */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">Info Toast</h3>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => toast.info("New features are now available!")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Show Info
              </Button>
              <Button
                onClick={() =>
                  toast.info("You have 3 new notifications to review", {
                    duration: 5000,
                  })
                }
                variant="outline"
                className="border-blue-600 text-blue-700 hover:bg-blue-50"
              >
                Info (5s)
              </Button>
            </div>
          </div>

          {/* Multiple Toasts */}
          <div className="space-y-2 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700">
              Multiple Toasts
            </h3>
            <Button
              onClick={() => {
                toast.info("Starting process...");
                setTimeout(() => toast.warning("Processing..."), 500);
                setTimeout(() => toast.success("Process completed!"), 1000);
              }}
              className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 hover:from-pink-600 hover:via-purple-600 hover:to-violet-700"
            >
              Show Sequential Toasts
            </Button>
          </div>

          {/* Spam Test */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">Stress Test</h3>
            <Button
              onClick={() => {
                for (let i = 1; i <= 5; i++) {
                  setTimeout(() => {
                    toast.info(`Toast ${i} of 5`);
                  }, i * 200);
                }
              }}
              variant="outline"
              className="w-full"
            >
              Show 5 Toasts Rapidly
            </Button>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8 p-4 bg-purple-50 rounded-xl border border-purple-200">
          <p className="text-sm text-purple-800">
            <strong>💡 Tip:</strong> The toast system supports auto-dismiss,
            manual close, and stacks multiple notifications beautifully. Try
            clicking multiple buttons to see how they stack!
          </p>
        </div>
      </div>
    </div>
  );
}
