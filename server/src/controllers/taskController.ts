import { Request, Response } from "express";
import { Task, TaskDocument } from "../models/Task";
import { sendError } from "../utils/http";

const activeTaskQuery = { archivedAt: null };

const syncCompletionState = (payload: Partial<TaskDocument>) => {
  if (payload.status === "done" && !payload.completedAt) {
    payload.completedAt = new Date();
  }

  if (payload.status && payload.status !== "done") {
    payload.completedAt = null;
  }

  return payload;
};

export const getTasks = async (_req: Request, res: Response) => {
  const tasks = await Task.find(activeTaskQuery).sort({ updatedAt: -1 });
  res.json({ tasks });
};

export const getTodayTasks = async (_req: Request, res: Response) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const tasks = await Task.find({
    ...activeTaskQuery,
    dueDate: { $gte: start, $lt: end }
  }).sort({ dueDate: 1, dueTime: 1, updatedAt: -1 });

  res.json({ tasks });
};

export const getOverdueTasks = async (_req: Request, res: Response) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tasks = await Task.find({
    ...activeTaskQuery,
    dueDate: { $lt: today },
    status: { $in: ["todo", "in_progress"] }
  }).sort({ dueDate: 1, updatedAt: -1 });

  res.json({ tasks });
};

export const getPinnedTasks = async (_req: Request, res: Response) => {
  const tasks = await Task.find({
    ...activeTaskQuery,
    pinned: true
  }).sort({ updatedAt: -1 });

  res.json({ tasks });
};

export const getTaskById = async (req: Request, res: Response) => {
  const task = await Task.findOne({
    _id: req.params.id,
    ...activeTaskQuery
  });

  if (!task) {
    return sendError(res, 404, "Task not found");
  }

  res.json({ task });
};

export const createTask = async (req: Request, res: Response) => {
  const task = await Task.create(
    syncCompletionState({
      ...req.body,
      title: req.body.title?.trim() || "Untitled task"
    })
  );

  res.status(201).json({ task });
};

export const updateTask = async (req: Request, res: Response) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    syncCompletionState({ ...req.body }),
    { new: true, runValidators: true }
  );

  if (!task) {
    return sendError(res, 404, "Task not found");
  }

  res.json({ task });
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  const { status } = req.body;

  if (!status) {
    return sendError(res, 400, "Status is required");
  }

  const task = await Task.findByIdAndUpdate(
    req.params.id,
    syncCompletionState({ status }),
    { new: true, runValidators: true }
  );

  if (!task) {
    return sendError(res, 404, "Task not found");
  }

  res.json({ task });
};

export const updateTaskPin = async (req: Request, res: Response) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { pinned: Boolean(req.body.pinned) },
    { new: true, runValidators: true }
  );

  if (!task) {
    return sendError(res, 404, "Task not found");
  }

  res.json({ task });
};

export const deleteTask = async (req: Request, res: Response) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    return sendError(res, 404, "Task not found");
  }

  res.status(204).send();
};
