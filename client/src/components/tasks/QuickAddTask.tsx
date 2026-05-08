import { useState } from "react";
import { Button } from "../common/Button";
import { Input } from "../common/Input";

export const QuickAddTask = ({
  onCreate,
  label = "Add Task"
}: {
  onCreate: (title: string) => Promise<void>;
  label?: string;
}) => {
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!title.trim()) {
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onCreate(title.trim());
      setTitle("");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create task right now."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              void submit();
            }
          }}
          placeholder="Create a task and open it for detailed notes..."
        />
        <Button onClick={() => void submit()} disabled={submitting}>
          {label}
        </Button>
      </div>
      {error ? (
        <div className="rounded-2xl border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
          {error}
        </div>
      ) : null}
    </div>
  );
};
