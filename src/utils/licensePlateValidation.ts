const LICENSE_PLATE_REGEX = "[A-Z]{3}[0-9][0-9A-Z][0-9]{2}";

export function validateLicensePlate(licensePlate: string) {
  const upperCaseLicensePlate = licensePlate.toUpperCase();

  const isValid = upperCaseLicensePlate.match(LICENSE_PLATE_REGEX);

  return isValid;
}
