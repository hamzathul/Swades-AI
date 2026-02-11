"use client";

interface TypingIndicatorProps {
  message?: string | null;
}

export function TypingIndicator({ message }: TypingIndicatorProps) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      {/* Avatar */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm">
        🤖
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-gray-100 px-4 py-3">
        {/* Bouncing dots */}
        <div className="flex gap-1">
          {[0, 150, 300].map((delay) => (
            <div
              key={delay}
              className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>

        {message && (
          <span className="ml-1 text-sm italic text-gray-500">{message}</span>
        )}
      </div>
    </div>
  );
}
