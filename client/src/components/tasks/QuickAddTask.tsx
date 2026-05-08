import { useEffect, useState } from "react";
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

  useEffect(() => {
    console.log("Current taskTitle state:", title);
  }, [title]);

  const submit = async () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Please enter a task title.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onCreate(trimmedTitle);
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submit();
  };

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <div className="flex gap-3">
        <Input
          value={title}
          onChange={(event) => {
            console.log("Task input changed:", event.target.value);
            setTitle(event.target.value);
          }}
          onPaste={(event) => {
            console.log("Paste event:", event.clipboardData?.getData("text"));
          }}
          autoComplete="off"
          placeholder="Create a task and open it for detailed notes..."
        />
        <Button type="submit" disabled={submitting}>
          {label}
        </Button>
      </div>
      {error ? (
        <div className="rounded-2xl border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
          {error}
        </div>
      ) : null}
    </form>
  );
};
