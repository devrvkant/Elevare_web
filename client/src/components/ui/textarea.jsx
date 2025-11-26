import * as React from "react";

const Textarea = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={
        "flex min-h-[100px] w-full rounded-xl border border-input bg-transparent px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/50 outline-none transition disabled:cursor-not-allowed disabled:opacity-50 resize-none " +
        className
      }
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
