'use client';
import { Timestamp } from 'firebase/firestore';

export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  initials: string;
  role: string;
};

export type UserProfile = {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  role?: 'Project Manager' | 'Team Member' | 'Mentor' | 'Viewer';
};

export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export type Comment = {
  id: string;
  user: User; // Will be migrated to UserProfile later
  comment: string;
  timestamp: string;
};

export type Task = {
  uid: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignees?: UserProfile[];
  ownerUid?: string;
  githubPr?: {
    url: string;
    number: number;
    title: string;
  };
  comments?: Comment[];
};

export type ProjectDocument = {
  uid: string;
  title: string;
  ownerUid: string;
  lastModified: Timestamp;
  url: string;
};

export type CalendarEvent = {
  uid: string;
  title: string;
  start: Timestamp;
  type: 'meeting' | 'deadline';
  meetingLink?: string;
};

export type Repository = {
  uid: string;
  name: string;
  description?: string;
  url: string;
  language?: string;
  stars?: number;
  forks?: number;
  lastCommit?: string;
  ownerUid: string;
  owner?: UserProfile;
};
