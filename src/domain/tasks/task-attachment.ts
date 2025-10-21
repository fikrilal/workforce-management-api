export type TaskAttachmentLink = {
  id: string;
  taskEntryId: string;
  label: string | null;
  url: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};
