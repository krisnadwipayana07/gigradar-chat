export type MessageData = {
  _id: string;
  senderId: string;
  rootId: string;
  message: string;
  parentId: string;
  createdAt: string;
  children: any[];
};

export type NextCursor = {
  creadtedAt: string;
  id: string;
};

export type ReplyType = {
  rootId: string;
  parentId: string;
  username: string;
  message: string;
};
