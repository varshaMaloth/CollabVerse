export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  initials: string;
  role: string;
};

export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export type Comment = {
  id: string;
  user: User;
  comment: string;
  timestamp: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignees: User[];
  githubPr?: {
    url: string;
    number: number;
    title: string;
  };
  comments: Comment[];
};

export type ProjectDocument = {
  id: string;
  title: string;
  owner: User;
  lastModified: string;
  url: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'meeting' | 'deadline';
};

export type Repository = {
  id: string;
  name: string;
  description: string;
  url: string;
  language: string;
  stars: number;
  forks: number;
  lastCommit: string;
  owner: User;
};
