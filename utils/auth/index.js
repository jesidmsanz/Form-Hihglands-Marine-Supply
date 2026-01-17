export const isInRole = (user, roleName) => {
  if (!user || !user.roles || user.roles.length === 0) {
    return false;
  }
  return user.roles.includes(roleName);
};

export const isInRoles = (user, roles = []) => {
  let exist = false;
  roles.forEach((roleName) => {
    if (!exist) {
      exist = isInRole(user, roleName);
    }
  });
  return exist;
};
