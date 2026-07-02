import { z } from 'zod';

export const RoleSchema = z.enum(['viewer', 'editor', 'admin', 'owner']);
export type Role = z.infer<typeof RoleSchema>;

export const PermissionActionSchema = z.enum([
  'read', 'create', 'update', 'delete', 'approve'
]);
export type PermissionAction = z.infer<typeof PermissionActionSchema>;

export const ResourceTypeSchema = z.enum([
  'workspace', 'canonical_entity', 'decision', 'proposal', 'connection'
]);
export type ResourceType = z.infer<typeof ResourceTypeSchema>;
