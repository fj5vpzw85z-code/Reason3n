import { Role, PermissionAction, ResourceType } from '@reason3n/contracts';

type Policy = Record<Role, Partial<Record<ResourceType, PermissionAction[]>>>;

const policies: Policy = {
  viewer: {
    canonical_entity: ['read'],
    decision: ['read'],
    proposal: ['read']
  },
  editor: {
    canonical_entity: ['read', 'create', 'update'],
    decision: ['read', 'create'],
    proposal: ['read', 'create', 'approve']
  },
  admin: {
    canonical_entity: ['read', 'create', 'update', 'delete'],
    decision: ['read', 'create'],
    proposal: ['read', 'create', 'approve', 'delete'],
    workspace: ['read', 'update'],
    connection: ['read', 'create', 'update', 'delete']
  },
  owner: {
    canonical_entity: ['read', 'create', 'update', 'delete'],
    decision: ['read', 'create'],
    proposal: ['read', 'create', 'approve', 'delete'],
    workspace: ['read', 'update', 'delete'],
    connection: ['read', 'create', 'update', 'delete']
  }
};

/**
 * Validates whether a user with a given role is allowed to perform an action on a resource.
 * Policy decision via central authorize() function as per Section 6.1
 */
export function authorize(role: Role, action: PermissionAction, resource: ResourceType): boolean {
  const allowedActions = policies[role]?.[resource] || [];
  return allowedActions.includes(action);
}
