import type { User, ProjectDocument, Repository } from '@/lib/types';

export const documents: ProjectDocument[] = [
  { id: 'doc-1', title: 'Project Proposal V2', owner: { id: 'user-1', name: 'Alice', avatarUrl: 'https://picsum.photos/seed/user1/40/40', initials: 'A', role: 'Project Manager' }, lastModified: '2024-05-20T10:00:00Z', url: '#' },
  { id: 'doc-2', title: 'Marketing Strategy Q3', owner: { id: 'user-4', name: 'Diana', avatarUrl: 'https://picsum.photos/seed/user4/40/40', initials: 'D', role: 'Designer' }, lastModified: '2024-05-19T15:30:00Z', url: '#' },
  { id: 'doc-3', title: 'API Design Guidelines', owner: { id: 'user-2', name: 'Bob', avatarUrl: 'https://picsum.photos/seed/user2/40/40', initials: 'B', role: 'Frontend Developer' }, lastModified: '2024-05-18T11:45:00Z', url: '#' },
  { id: 'doc-4', title: 'User Research Findings', owner: { id: 'user-1', name: 'Alice', avatarUrl: 'https://picsum.photos/seed/user1/40/40', initials: 'A', role: 'Project Manager' }, lastModified: '2024-05-17T09:00:00Z', url: '#' },
  { id: 'doc-5', title: 'Sprint Planning Notes', owner: { id: 'user-3', name: 'Charlie', avatarUrl: 'https://picsum.photos/seed/user3/40/40', initials: 'C', role: 'Backend Developer' }, lastModified: '2024-05-21T14:00:00Z', url: '#' },
];
