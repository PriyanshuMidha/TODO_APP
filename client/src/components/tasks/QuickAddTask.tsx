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

  const submit = async () => {
    if (!title.trim()) {
      return;
    }

    setSubmitting(true);
    try {
      await onCreate(title.trim());
      setTitle("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
  );
};
