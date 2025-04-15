export interface Task {
  id: number;
  title: string;
  description: string;
  typeId: number;
  statusId: number;
  assignedTo: number | null;
  createdOn: Date;
}
