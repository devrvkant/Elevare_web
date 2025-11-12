import * as React from "react";

const Textarea = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={
        "flex min-h-[100px] w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition disabled:cursor-not-allowed disabled:opacity-50 resize-none " +
        className
      }
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
