/**
 * Shared Sign Up validation (used by auth/SignUp1.js and auth/OtpVerification.js)
 * Covers NWB-BUG-001 to NWB-BUG-009.
 */

/* ---------- limits (change here if product wants different values) ---------- */
export const NAME_MIN = 2; // NWB-BUG-011: "g" must be rejected (limit not in requirements - confirm)
export const NAME_MAX = 50;
export const CITY_MIN = 2; // NWB-BUG-021: "T" must be rejected (confirm)
export const CITY_MAX = 50;
export const EMAIL_MAX = 100;
export const COMPANY_MAX = 100; // NWB-BUG-014 (confirm)

/* ---------- spaces ---------- */
// "  Anna   Nagar " -> "Anna Nagar"   (trims both ends, collapses repeated spaces)
export const cleanSpaces = (value = "") => value.replace(/\s+/g, " ").trim();

/* ---------- Full Name / City : letters and single spaces only ---------- */
const stripToLetters = (value = "") =>
  value
    .replace(/[^a-zA-Z\s]/g, "") // no digits / special characters
    .replace(/^\s+/, "") // no leading spaces while typing
    .replace(/\s{2,}/g, " "); // no repeated spaces while typing

export const sanitizeNameInput = (value) => stripToLetters(value).slice(0, NAME_MAX);
export const sanitizeCityInput = (value) => stripToLetters(value).slice(0, CITY_MAX);

export const LETTERS_ONLY_REGEX = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;

/* ---------- Email ---------- */
// letters/digits with single . _ % + - between them, one @, dotted domain, TLD of 2+ letters
export const EMAIL_REGEX =
  /^[A-Za-z0-9]+(?:[._%+-][A-Za-z0-9]+)*@[A-Za-z0-9]+(?:[.-][A-Za-z0-9]+)*\.[A-Za-z]{2,}$/;

export const EMAIL_LOCAL_MAX = 40; // standard limit for the part before the @

// The last part of the domain (".com", ".in" ...) must be a real ending, so text glued on
// after it, like "jack@gmail.comTEST", is rejected. Allowed: any 2-letter country ending
// (.in, .uk, .au ...) or one of the common endings below. Add more here if one is missing.
const KNOWN_TLDS = new Set([
  "com", "net", "org", "edu", "gov", "mil", "int", "info", "biz", "name", "pro",
  "io", "co", "ai", "app", "dev", "tech", "online", "site", "store", "shop",
  "blog", "cloud", "live", "life", "world", "today", "email", "news", "link",
  "club", "space", "website", "digital", "agency", "center", "company", "group",
  "network", "solutions", "services", "systems", "global", "media", "studio",
  "design", "finance", "capital", "estate", "properties", "property", "realty",
  "homes", "house", "builders", "construction", "land", "city", "xyz",
]);

// Mail providers with one fixed address ending, e.g. only "name@gmail.com" is valid.
const FIXED_PROVIDER_DOMAINS = { gmail: "gmail.com" };

const hasValidDomainEnding = (domain = "") => {
  const parts = domain.toLowerCase().split(".");
  const ending = parts[parts.length - 1];
  if (!(/^[a-z]{2}$/.test(ending) || KNOWN_TLDS.has(ending))) return false;

  const fixedDomain = FIXED_PROVIDER_DOMAINS[parts[0]];
  if (fixedDomain && domain.toLowerCase() !== fixedDomain) return false; // e.g. gmail.com.in, gmail.comTEST

  return true;
};

export const isValidEmail = (email = "") =>
  email.length <= EMAIL_MAX &&
  email.split("@")[0].length <= EMAIL_LOCAL_MAX &&
  EMAIL_REGEX.test(email) &&
  hasValidDomainEnding(email.split("@")[1]);

/* ---------- Mobile : rules depend on the selected country ---------- */
// digits are entered WITHOUT the country code and WITHOUT a leading 0
export const COUNTRY_MOBILE_RULES = {
  "+91": { label: "India", maxLength: 10, regex: /^[6-9]\d{9}$/, example: "9876543210", hint: "10 digits, starting with 6, 7, 8 or 9" },
  "+1": { label: "US", maxLength: 10, regex: /^[2-9]\d{2}[2-9]\d{6}$/, example: "2025550123", hint: "10 digits, area code and exchange cannot start with 0 or 1" },
  "+44": { label: "UK", maxLength: 10, regex: /^7[1-57-9]\d{8}$/, example: "7123456789", hint: "10 digits, starting with 7 (drop the leading 0)" },
  "+61": { label: "Australia", maxLength: 9, regex: /^4\d{8}$/, example: "412345678", hint: "9 digits, starting with 4 (drop the leading 0)" },
  "+81": { label: "Japan", maxLength: 10, regex: /^[789]0\d{8}$/, example: "9012345678", hint: "10 digits, starting with 70, 80 or 90 (drop the leading 0)" },
  "+49": { label: "Germany", maxLength: 11, regex: /^1[567]\d{8,9}$/, example: "15123456789", hint: "10 or 11 digits, starting with 15, 16 or 17 (drop the leading 0)" },
  "+971": { label: "UAE", maxLength: 9, regex: /^5[024568]\d{7}$/, example: "501234567", hint: "9 digits, starting with 50, 52, 54, 55, 56 or 58 (drop the leading 0)" },
  "+7": { label: "Russia", maxLength: 10, regex: /^9\d{9}$/, example: "9123456789", hint: "10 digits, starting with 9" },
  "+27": { label: "South Africa", maxLength: 9, regex: /^[678]\d{8}$/, example: "821234567", hint: "9 digits, starting with 6, 7 or 8 (drop the leading 0)" },
};

const FALLBACK_RULE = { label: "", maxLength: 10, regex: /^\d{6,10}$/, example: "", hint: "6 to 10 digits" };

export const getMobileRule = (countryCode) =>
  COUNTRY_MOBILE_RULES[countryCode] || FALLBACK_RULE;

// returns "" when valid, otherwise the message to show under the field
export const validateMobile = (countryCode, digits = "") => {
  const rule = getMobileRule(countryCode);
  if (rule.regex.test(digits)) return "";
  const where = rule.label ? `a valid ${rule.label} (${countryCode}) mobile number` : "a valid mobile number";
  return `Enter ${where}: ${rule.hint}.`;
};

/* ---------- Server messages ---------- */
export const EMAIL_EXISTS_MSG = "Email already registered.";

// Turns technical / duplicate-email server messages into a plain one.
export const friendlyServerMessage = (message) => {
  if (!message || typeof message !== "string") return message;
  const m = message.toLowerCase();
  const mentionsEmail = /e-?mail/.test(m);
  const mentionsMobile = /mobile|phone/.test(m);
  const looksDuplicate = /already|exist|registered|duplicate|taken|in use|unique|e11000/.test(m);
  if (mentionsEmail && looksDuplicate && !mentionsMobile) return EMAIL_EXISTS_MSG;
  return message;
};

/* ---------- Company Name (Builder/Developer) ---------- */
// Real company names contain digits and symbols ("L&T Constructions", "3B Builders Pvt. Ltd."),
// so we allow letters, digits, spaces and & . , - ' ( ) but the name must contain a letter,
// which rejects numeric-only ("1234") and symbol-only ("@#$") input.
const COMPANY_ALLOWED_CHARS = /[^A-Za-z0-9\s&.,'()-]/g;

export const sanitizeCompanyInput = (value = "") =>
  value
    .replace(COMPANY_ALLOWED_CHARS, "")
    .replace(/^\s+/, "") // no leading spaces while typing
    .replace(/\s{2,}/g, " ")
    .slice(0, COMPANY_MAX);

export const validateCompanyName = (value = "") => {
  if (!value) return "Company Name is required";
  if (!/[A-Za-z]/.test(value))
    return "Company Name must contain letters (numbers or symbols alone are not allowed)";
  if (value.length < 2) return "Company Name must be at least 2 characters";
  if (value.length > COMPANY_MAX) return `Company Name cannot exceed ${COMPANY_MAX} characters`;
  return "";
};

/* ---------- International phone (forms without a country dropdown) ---------- */
// E.164, the international standard, allows at most 15 digits including the country code.
// 7 is used as the practical minimum. Countries differ in length, so a range is used,
// not one fixed length. (Confirm the minimum with the product requirement.)
export const PHONE_MIN_DIGITS = 7;
export const PHONE_MAX_DIGITS = 15;

// keeps digits and one leading "+"; strips spaces, dashes, brackets; caps the length
export const sanitizePhoneInput = (value = "") => {
  const plus = value.trimStart().startsWith("+") ? "+" : "";
  return plus + value.replace(/\D/g, "").slice(0, PHONE_MAX_DIGITS);
};

export const validateInternationalPhone = (value = "") => {
  const digits = value.replace(/\D/g, "");
  if (digits.length < PHONE_MIN_DIGITS || digits.length > PHONE_MAX_DIGITS)
    return `Enter a valid phone number with country code (${PHONE_MIN_DIGITS} to ${PHONE_MAX_DIGITS} digits)`;
  return "";
};

/* ---------- Contact Us / Feedback form ---------- */
export const PROPERTY_NAME_MAX = 100; // NWB-BUG-036 (not specified in requirements - confirm)
export const FEEDBACK_MIN = 10; // NWB-BUG-037 (minimum not specified - confirm)
export const FEEDBACK_PHONE_DIGITS = 10; // NWB-BUG-032 / 033: QA expects exactly 10 digits

// Property / project names may contain digits and a few symbols ("Sai Heights - Phase 2",
// "Kumar's Residency"), but must contain a letter, so "@#$%" and "1234" are rejected.
export const sanitizePropertyNameInput = (value = "") =>
  value
    .replace(COMPANY_ALLOWED_CHARS, "")
    .replace(/^\s+/, "")
    .replace(/\s{2,}/g, " ")
    .slice(0, PROPERTY_NAME_MAX);

export const validatePropertyName = (value = "") => {
  if (!value) return "Property/Project Name is required";
  if (!/[A-Za-z]/.test(value))
    return "Property/Project Name must contain letters (numbers or symbols alone are not allowed)";
  if (value.length < 2) return "Property/Project Name must be at least 2 characters";
  if (value.length > PROPERTY_NAME_MAX)
    return `Property/Project Name cannot exceed ${PROPERTY_NAME_MAX} characters`;
  return "";
};

// digits only, capped at 10; a pasted "+91 98765 43210" keeps just the 10-digit number
export const sanitizeTenDigitPhone = (value = "") => {
  let digits = value.replace(/\D/g, "");
  const pastedWithCountryCode =
    (value.trim().startsWith("+91") && digits.length > FEEDBACK_PHONE_DIGITS) ||
    (digits.length === 12 && digits.startsWith("91"));
  if (pastedWithCountryCode) digits = digits.slice(2);
  return digits.slice(0, FEEDBACK_PHONE_DIGITS);
};

export const validateTenDigitPhone = (value = "") =>
  new RegExp(`^\\d{${FEEDBACK_PHONE_DIGITS}}$`).test(value)
    ? ""
    : `Enter a valid ${FEEDBACK_PHONE_DIGITS}-digit phone number`;

// feedback must contain real words, not just digits or symbols
export const validateFeedback = (value = "") => {
  if (!value) return "Feedback is required";
  if (!/[A-Za-z]/.test(value)) return "Feedback must contain text (numbers or symbols alone are not allowed)";
  if (value.length < FEEDBACK_MIN) return `Feedback must be at least ${FEEDBACK_MIN} characters`;
  return "";
};