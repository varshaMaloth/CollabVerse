import type { User, Task, ProjectDocument, CalendarEvent, Repository } from '@/lib/types';

export const users: User[] = [
  { id: 'user-1', name: 'Alice', avatarUrl: 'https://picsum.photos/seed/user1/40/40', initials: 'A', role: 'Project Manager' },
  { id: 'user-2', name: 'Bob', avatarUrl: 'https://picsum.photos/seed/user2/40/40', initials: 'B', role: 'Frontend Developer' },
  { id: 'user-3', name: 'Charlie', avatarUrl: 'https://picsum.photos/seed/user3/40/40', initials: 'C', role: 'Backend Developer' },
  { id: 'user-4', name: 'Diana', avatarUrl: 'https://picsum.photos/seed/user4/40/40', initials: 'D', role: 'Designer' },
];

export const documents: ProjectDocument[] = [
  { id: 'doc-1', title: 'Project Proposal V2', owner: users[0], lastModified: '2024-05-20T10:00:00Z', url: '#' },
  { id: 'doc-2', title: 'Marketing Strategy Q3', owner: users[3], lastModified: '2024-05-19T15:30:00Z', url: '#' },
  { id: 'doc-3', title: 'API Design Guidelines', owner: users[1], lastModified: '2024-05-18T11:45:00Z', url: '#' },
  { id: 'doc-4', title: 'User Research Findings', owner: users[0], lastModified: '2024-05-17T09:00:00Z', url: '#' },
  { id: 'doc-5', title: 'Sprint Planning Notes', owner: users[2], lastModified: '2024-05-21T14:00:00Z', url: '#' },
];

export const events: CalendarEvent[] = [
  { id: 'event-1', title: 'Daily Stand-up', start: new Date(new Date().setDate(new Date().getDate())), end: new Date(new Date().setHours(9, 30)), type: 'meeting' },
  { id: 'event-2', title: 'Sprint Planning', start: new Date(new Date().setDate(new Date().getDate() + 1)), end: new Date(new Date().setHours(11, 0)), type: 'meeting' },
  { id: 'event-3', title: 'Design Review', start: new Date(new Date().setDate(new Date().getDate() + 2)), end: new Date(new Date().setHours(14, 0)), type: 'meeting' },
  { id: 'event-4', title: 'Alpha Release Deadline', start: new Date(new Date().setDate(new Date().getDate() + 4)), end: new Date(new Date().setHours(17, 0)), type: 'deadline' },
];

export const repositories: Repository[] = [
    {
      id: 'repo-1',
      name: 'project-hub-frontend',
      description: 'The frontend for our amazing Project Hub application, built with Next.js.',
      url: '#',
      language: 'TypeScript',
      stars: 128,
      forks: 12,
      lastCommit: '2 hours ago',
      owner: users[0],
    },
    {
      id: 'repo-2',
      name: 'project-hub-backend',
      description: 'The backend services and API for Project Hub.',
      url: '#',
      language: 'Go',
      stars: 95,
      forks: 8,
      lastCommit: '5 hours ago',
      owner: users[1],
    },
    {
      id: 'repo-3',
      name: 'design-system',
      description: 'Shared UI components and design tokens.',
      url: '#',
      language: 'TypeScript',
      stars: 210,
      forks: 25,
      lastCommit: '1 day ago',
      owner: users[2],
    },
];
