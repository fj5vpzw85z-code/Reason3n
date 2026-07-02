import { Request, Response, NextFunction } from 'express';
import { authorize } from '../rbac/authorize';
import { PermissionAction, ResourceType } from '@reason3n/contracts';

export function requirePermission(action: PermissionAction, resource: ResourceType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const isAllowed = authorize(user.role, action, resource);
    if (!isAllowed) {
      return res.status(403).json({ error: `Forbidden: Cannot ${action} ${resource}` });
    }

    next();
  };
}
