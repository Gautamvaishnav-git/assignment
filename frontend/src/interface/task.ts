export interface Task {
  taskID: number;
  taskName: string;
  description?: string;
  status: "OPEN" | "IN_PROGRESS" | "DONE";
}

export interface ListType {
  listID: number;
  listName: string;
  tasks: Task[];
}
