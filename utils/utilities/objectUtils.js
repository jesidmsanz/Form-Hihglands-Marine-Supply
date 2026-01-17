/**
 * Serialize MongoDB Json
 * @param {*} json
 * @returns
 */
export const serializeJSON = (json) => {
  const jsonStr = JSON.stringify(json);
  return JSON.parse(jsonStr);
};
