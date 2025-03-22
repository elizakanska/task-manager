export interface Task {
  id: number;
  title: string;
  description: string;
  typeId: number;
  statusId: number;
  createdOn: Date;
}
