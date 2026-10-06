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