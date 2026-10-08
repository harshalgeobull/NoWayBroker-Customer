/**
 * Validation for the Add New Property / Edit Property forms
 * (NWB-BUG-045 to NWB-BUG-060). Shared by postproperty/AddNewProperty.js and
 * postproperty/EditProperty.js.
 *
 * Limits below are NOT in the QA data / requirements - confirm with product.
 */
export const ADDRESS_MIN = 5;
export const ADDRESS_MAX = 250;
export const CITY_MIN = 2;
export const CITY_MAX = 50;

// "  Pune   City " -> "Pune City"
export const cleanSpaces = (value = "") => String(value).replace(/\s+/g, " ").trim();

/* ---------- Building / Society / Project Name (NWB-BUG-045) ---------- */
// Keeps the existing rule (letters, digits, spaces) and adds: it must contain a letter,
// so "56" is rejected while "Building 56" is still fine.
export const validateBuildingName = (raw = "") => {
  const value = String(raw).trim();
  if (!value) return "Property Name is required";
  if (!/^[a-zA-Z0-9\s]+$/.test(String(raw))) return "Alphanumeric fields only";
  if (!/[a-zA-Z]/.test(value))
    return "Name must contain letters (numbers alone are not allowed)";
  return "";
};

/* ---------- Address (NWB-BUG-050 to 054) ---------- */
// Numbers are fine inside an address ("123 MG Road"); numbers ONLY are not.
export const validateAddress = (raw = "") => {
  const value = cleanSpaces(raw);
  if (!value) return "Address is required";
  if (!/\p{L}/u.test(value))
    return "Address must contain letters (numbers alone are not allowed)";
  if (value.length < ADDRESS_MIN)
    return `Address must be at least ${ADDRESS_MIN} characters`;
  if (value.length > ADDRESS_MAX)
    return `Address cannot exceed ${ADDRESS_MAX} characters`;
  return "";
};

/* ---------- City (NWB-BUG-055, 056, 058, 059, 060) ---------- */
// Typing: letters, spaces and . ' - only (no digits). "-" etc. stay allowed because
// names filled in automatically from Google Maps can contain them (e.g. Pimpri-Chinchwad).
export const sanitizeCityTyping = (value = "") =>
  String(value)
    .replace(/[^\p{L}\p{M}\s.'-]/gu, "")
    .replace(/^\s+/, "") // no leading space
    .replace(/\s{2,}/g, " ")
    .slice(0, CITY_MAX);

export const validateCity = (raw = "") => {
  const value = cleanSpaces(raw);
  if (!value) return "city name is required";
  if (!/\p{L}/u.test(value))
    return "City must contain letters (numbers alone are not allowed)";
  if (value.length < CITY_MIN) return `City must be at least ${CITY_MIN} characters`;
  if (value.length > CITY_MAX) return `City cannot exceed ${CITY_MAX} characters`;
  return "";
};

/* ---------- Zip / postal code (NWB-BUG-057) ---------- */
// Postal codes differ by country, so the rule follows the selected country.
// India and US are specific; any other country gets a general 3 to 10 character check.
const ZIP_RULES = {
  IN: { regex: /^[1-9]\d{5}$/, max: 6, message: "Enter a valid 6-digit PIN code" },
  US: { regex: /^\d{5}(\d{4})?$/, max: 9, message: "Enter a valid 5-digit ZIP code" },
};
const ZIP_FALLBACK = {
  regex: /^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/,
  max: 10,
  message: "Enter a valid postal code (3 to 10 characters)",
};

const zipRuleFor = (country = "") => {
  const c = String(country).trim().toUpperCase();
  if (c === "IN" || c === "INDIA") return ZIP_RULES.IN;
  if (c === "US" || c === "USA" || c === "UNITED STATES") return ZIP_RULES.US;
  return ZIP_FALLBACK;
};

export const getZipMaxLength = (country) => zipRuleFor(country).max;

export const validateZip = (country, raw = "") => {
  const value = String(raw).trim();
  if (!value) return "zip code is required";
  return zipRuleFor(country).regex.test(value) ? "" : zipRuleFor(country).message;
};

/* ---------- Paying Guest ---------- */
export const PG_PROPERTY_TYPES = [
  "Apartment",
  "Builder Floor",
  "1RK/Studio Apartment",
  "Independent House/Villa",
  "Service Apartment",
];
export const PG_COMMERCIAL_MSG =
  "Commercial is not available for Paying Guest. Please select Residential.";

/* =====================================================================
 * Property Details / Amenities / Photos & Videos  (NWB-BUG-061 to 083)
 * Limits and conversion values below are NOT in the QA data - confirm with product.
 * ===================================================================== */

/* ---------- Property Price (NWB-BUG-061, 065) ---------- */
export const PRICE_MAX_DIGITS = 12;

export const validatePropertyPrice = (raw = "") => {
  const value = String(raw ?? "").replace(/,/g, "").trim();
  if (!value) return "Property Price is required";
  if (!/^\d+$/.test(value)) return "Enter a valid price (numbers only)";
  if (value.length > PRICE_MAX_DIGITS)
    return `Property Price cannot exceed ${PRICE_MAX_DIGITS} digits`;
  return "";
};

/* ---------- Carpet / Built-up area (NWB-BUG-066 to 077) ---------- */
// Approximate sq.ft in one unit, as [smallest, largest]. Units that differ from region to
// region (bigha, kottah, biswa) have a range, so a combination is flagged only when it is
// impossible under EVERY possible meaning of the unit.
export const AREA_UNIT_SQFT = {
  "sq.ft": [1, 1],
  "sq.yards": [9, 9],
  "sq.m": [10.7639, 10.7639],
  acre: [43560, 43560],
  marla: [272.25, 272.25],
  cents: [435.6, 435.6],
  bigha: [3000, 27500],
  kottah: [720, 3645],
  kanal: [5445, 5445],
  grounds: [2400, 2400],
  ares: [1076.39, 1076.39],
  biswa: [435, 1400],
  guntha: [1089, 1089],
  aankadam: [72, 72],
  hectares: [107639, 107639],
  rood: [10890, 10890],
  chataks: [45, 45],
  perch: [272.25, 272.25],
};

export const MIN_AREA_SQFT = 10; // smaller than this is "unrealistically small" (NWB-BUG-074, 075)
export const MAX_BUILTUP_TO_CARPET_RATIO = 3; // built-up more than 3x carpet is unrealistic (NWB-BUG-076)

const sqftRange = (value, unit) => {
  // matching ignores capital letters, so saved values like "Acre" still work
  const [low, high] =
    AREA_UNIT_SQFT[String(unit ?? "").trim().toLowerCase()] || [1, 1]; // no unit chosen yet: treat as sq.ft
  return [value * low, value * high];
};

// label is "Carpet area" or "Built-up area"
export const validateAreaValue = (label, raw, unit) => {
  const text = String(raw ?? "").trim();
  if (!text) return `${label} is required`;
  const number = Number(text);
  if (!Number.isFinite(number) || number <= 0) return `${label} must be greater than 0`;
  const [, largestSqft] = sqftRange(number, unit);
  if (largestSqft < MIN_AREA_SQFT)
    return `${label} is too small. Please enter a realistic area`;
  return "";
};

export const validateAreaUnit = (label, unit) =>
  String(unit ?? "").trim() ? "" : `${label} unit is required`;

// Carpet area can never be bigger than built-up area, and built-up area can't be absurdly bigger.
export const validateAreaPair = ({ carpet, carpetUnit, builtUp, builtUpUnit }) => {
  const c = Number(carpet);
  const b = Number(builtUp);
  if (!(c > 0) || !(b > 0) || !carpetUnit || !builtUpUnit) return {};
  const [carpetLow, carpetHigh] = sqftRange(c, carpetUnit);
  const [builtLow, builtHigh] = sqftRange(b, builtUpUnit);
  if (carpetLow > builtHigh)
    return {
      carpetArea:
        "Carpet area cannot be larger than Built-up area. Please check the values and units",
    };
  if (builtLow > MAX_BUILTUP_TO_CARPET_RATIO * carpetHigh)
    return {
      builtUpArea:
        "Built-up area is unrealistically large compared to Carpet area. Please check the values and units",
    };
  return {};
};

/* ---------- Video URL (NWB-BUG-080, 081, 083) ---------- */
// optional http(s)://, a real domain with a dot and an ending, optional port/path
const VIDEO_URL_REGEX = /^(https?:\/\/)?([A-Za-z0-9-]+\.)+[A-Za-z]{2,}(:\d{1,5})?(\/\S*)?$/;

export const validateVideoUrl = (raw = "") => {
  const value = String(raw ?? "").trim();
  if (!value) return "";
  return VIDEO_URL_REGEX.test(value)
    ? ""
    : "Enter a valid video URL (e.g. https://www.youtube.com/watch?v=...)";
};

/* ---------- Photos (NWB-BUG-082) ---------- */
export const MAX_PROPERTY_PHOTOS = 5; // stated in the bug; confirm with business

/* ---------- Amenity label typo coming from the amenities list (NWB-BUG-078) ---------- */
export const fixAmenityLabel = (name = "") => String(name).replace(/Chidren/g, "Children");

/* =====================================================================
 * Plot/Land Property Details round  (NWB-BUG-084 to 105)
 * Limits below are NOT in the QA data - confirm with product.
 * ===================================================================== */

/* ---------- Error messages start with a capital letter (NWB-BUG-102) ---------- */
export const capitalizeFirst = (text = "") =>
  typeof text === "string" && text ? text.charAt(0).toUpperCase() + text.slice(1) : text;

/* ---------- Total Floor: digits only (NWB-BUG-099) ---------- */
// 3 digits: the form builds a list of floors from this number, so it must stay small
export const TOTAL_FLOOR_MAX_DIGITS = 3;

/* ---------- Parking counts: limited number of digits (NWB-BUG-103, 104) ---------- */
export const PARKING_MAX_DIGITS = 2;
export const PARKING_MAX = Math.pow(10, PARKING_MAX_DIGITS) - 1; // 99

export const sanitizeParkingCount = (value = "") =>
  String(value ?? "").replace(/\D/g, "").slice(0, PARKING_MAX_DIGITS);

/* ---------- Flat / House No (NWB-BUG-100, 101) ---------- */
// Letters, digits, spaces and the usual symbols stay allowed, and the 20-character limit is
// already enforced while typing. Only input made of special characters alone is rejected.
export const validateFlatNo = (raw = "") => {
  const value = String(raw ?? "").trim();
  if (!value) return "";
  if (!/[A-Za-z0-9]/.test(value))
    return "Must contain letters or numbers (special characters alone are not allowed)";
  return "";
};

/* ---------- Possession / available date (NWB-BUG-098) ---------- */
export const POSSESSION_YEAR_MIN = 2000;
export const POSSESSION_YEARS_AHEAD = 20;

export const validatePossessionDate = (raw = "") => {
  const value = String(raw ?? "").trim().split("T")[0];
  if (!value) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return "Enter a valid date";
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day)
    return "Enter a valid date";
  const maxYear = new Date().getFullYear() + POSSESSION_YEARS_AHEAD;
  if (year < POSSESSION_YEAR_MIN || year > maxYear)
    return `Enter a valid date (year between ${POSSESSION_YEAR_MIN} and ${maxYear})`;
  return "";
};