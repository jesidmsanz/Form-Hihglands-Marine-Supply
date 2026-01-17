import { parseISO, formatDistance } from 'date-fns';
import { publicEnv } from '../publicEnv';

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
    return txt?.charAt(0)?.toUpperCase() + txt?.substr(1)?.toLowerCase().replace(/-/g, ' ');
  });
}

/**
 *  Convert text to sentence case
 * @param {string} str
 * @returns
 */
export function toSentenceCase(str) {
  return (
    str?.charAt(0)?.toUpperCase() +
    str
      ?.substr(1)
      ?.toLowerCase()
      .trim()
      .replace(/\w\./g, function (txt) {
        return txt.toUpperCase();
      })
      .replace(/\.\w/g, function (txt) {
        return txt.toUpperCase();
      })
  );
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

export function stringToSlug(str) {
  if (!str) {
    return '';
  }
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
  var to = 'aaaaeeeeiiiioooouuuunc------';
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
}

export function cleanFilterName(name) {
  return name?.replace(/-/g, ' dash ');
}

export function getImageUrl(image, size = 'medium') {
  if (!image?.filePath) {
    return '/images/coming-soon.svg';
  }
  const named = size;
  return `${publicEnv.imagekitUrlEndpoint}tr:n-${named}${image?.filePath}`;
}

export function formatMoney(numToFormat, prefix = '$', decimals = 0) {
  const num = isNaN(numToFormat) ? 0 : parseInt(numToFormat, 10);
  return prefix + num.toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export function kFormatter(num) {
  return Math.abs(num) > 999
    ? `${Math.sign(num) * (Math.abs(num) / 1000).toFixed(1)}k`
    : Math.sign(num) * Math.abs(num);
}

export function formatRangeMoney(minRent, maxRent) {
  let result = '';
  if (minRent === maxRent) {
    result = formatMoney(maxRent);
  } else {
    result = `${formatMoney(minRent)} - ${formatMoney(maxRent)}`;
  }
  if (result === '$0') {
    result = 'Contact Us for Price';
  }
  return result;
}

export function formatRangeMoneyKFormatter(minRent, maxRent) {
  let result = '';
  if (minRent === maxRent) {
    result = `$${kFormatter(maxRent)}`;
  } else {
    result = `$${kFormatter(minRent)}`;
  }
  return result;
}

export function formatRangeBeds(minBeds, maxBeds, minZeroBedName, maxZeroBedName) {
  let result = '';
  const bedSufix = isNaN(maxBeds) ? '' : maxBeds > 1 ? ' Beds' : ' Bed';
  if (minBeds === maxBeds) {
    maxBeds
      ? (result = `${formatZeroBed(maxBeds, maxZeroBedName)} ${bedSufix}`)
      : (result = `${formatZeroBed(maxBeds, maxZeroBedName)}`);
  } else {
    result = `${formatZeroBed(minBeds, minZeroBedName)} - ${formatZeroBed(
      maxBeds,
      maxZeroBedName
    )} ${bedSufix}`;
  }
  return result;
}

function formatZeroBed(beds, zeroBedName) {
  let result = beds;
  if (beds?.toString() === '0') result = zeroBedName || 'Studio';
  return result;
}

export function formatRangeBaths(minBaths, maxBaths) {
  let result = '';
  const bedSufix = isNaN(maxBaths) ? '' : maxBaths > 1 ? ' Baths' : ' Bath';
  if (minBaths === maxBaths) {
    result = maxBaths;
  } else {
    result = `${minBaths} - ${maxBaths}`;
  }
  // console.log('result', result);
  if (typeof result === 'string') result = result.replace(/\.00/gi, '').replace(/\.50/gi, '.5');
  return result + bedSufix;
}

export function objectToQueryParams(query) {
  const queryParams = `?${Object.keys(query)
    .map((key) => `${key}=${query[key]}`)
    .join('&')}`;
  return queryParams;
}

export function cleanParamUrl(param) {
  if (!param) return '';
  return param.toLowerCase().replace(/\s/g, '-');
}

export function changeSizeArrayImage(picturesArray, pathSize) {
  return picturesArray.map((item) => {
    const indexFound = item.url.split('/', 4).join('/').length;
    return {
      _id: item._id,
      url:
        item.url.substring(0, indexFound) +
        pathSize +
        item.url.substring(indexFound, item.url.length),
    };
  });
}

export function giveMeTheCaptions(picturesArray) {
  return picturesArray.map((item) => {
    return item.caption || '';
  });
}

export function formatPhoneText(text) {
  if (!text) return '';

  // Limpiar el texto de espacios y caracteres especiales
  let cleanText = text.replace(/[\s\-\(\)\.]/g, '');

  // Si empieza con +1, removerlo
  if (cleanText.startsWith('+1')) {
    cleanText = cleanText.substring(2);
  }

  // Si empieza con 1, removerlo
  if (cleanText.startsWith('1') && cleanText.length === 11) {
    cleanText = cleanText.substring(1);
  }

  // Verify it's a valid 10-digit number
  if (cleanText.length === 10 && /^\d{10}$/.test(cleanText)) {
    return `(${cleanText.substring(0, 3)}) ${cleanText.substring(3, 6)}-${cleanText.substring(6)}`;
  }

  // Si es un número de 11 dígitos que empieza con 1
  if (cleanText.length === 11 && cleanText.startsWith('1')) {
    cleanText = cleanText.substring(1);
    return `(${cleanText.substring(0, 3)}) ${cleanText.substring(3, 6)}-${cleanText.substring(6)}`;
  }

  // Si no coincide con ningún formato, devolver el original
  return text;
}

export function cleanUrl(value) {
  return value
    .replace(/^\s+|\s+$/gm, '')
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function capitalCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getDetailLink(address = 'address', city = 'city', state, zip, id) {
  return `/detail/${cleanUrl(address)}-${cleanUrl(city)}-${state}-${zip}/${id}`;
}

export function callImagesFolder(r) {
  const images = {};
  r.keys().forEach((item, index) => {
    const module = r(item);
    images[item.replace('./', '')] = module.__esModule ? module.default : module;
  });
  const imagesArray = Object.keys(images).map((itm) => images[itm]);
  return imagesArray.slice(0, imagesArray.length / 2);
}

export function changeSizeImage(picture, pathSize) {
  if (picture) {
    const indexFound = picture.split('/', 4).join('/').length;

    return (
      picture.substring(0, indexFound) + pathSize + picture.substring(indexFound, picture.length)
    );
  } else {
    return '/images/coming-soon.svg';
  }
}
