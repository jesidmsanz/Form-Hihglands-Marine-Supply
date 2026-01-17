import { parseISO, formatDistance } from "date-fns";

/**
 *  Get Date Distance From Today in A Human Friendly Format
 * @param {string} dateString
 * @returns {string}
 */
export function getDateDistance(dateString) {
  return formatDistance(parseISO(dateString), new Date(), { addSuffix: false });
}

/**
 *  Convert text to title case
 * @param {string} str
 * @returns
 */
export function toTitleCase(str) {
  return str?.replace(/\w\S*/g, function (txt) {
    return txt?.charAt(0)?.toUpperCase() + txt?.substr(1)?.toLowerCase();
  });
}

/**
 *  Truncate a text
 * @param {string} str
 * @param {number} length
 * @returns
 */
export function truncateText(str, length) {
  if (str?.length > length) {
    return `${str?.slice(0, length)?.trim()}…`;
  }
  return str;
}
