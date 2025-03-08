export enum Role {
  Superadmin = 'Superadmin',
  OrgAdmin = 'Org Admin',
  ChapterAdmin = 'Chapter Admin',
  ChapterMember = 'Chapter Member',
}

export function compareRoles(a: Role, b: Role): number {
  const roles = Object.values(Role);

  const indexOfA = roles.indexOf(a);
  const indexOfB = roles.indexOf(b);

  return indexOfA - indexOfB;
}

export function hasRequiredRole(userRole?: Role, minimumRole?: Role): boolean {
  if (!minimumRole) return true;
  if (!userRole) return false;

  return compareRoles(userRole, minimumRole) <= 0;
}
