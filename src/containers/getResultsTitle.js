export const getResultsTitle = ({
  bhkType,
  propertyType,
  propertyType2,
  buildingType,
  postedBy,
  searchLocation = "",
  filtersApplied = true,
  pageTitle = "",
  isNearMe = false,
}) => {
   console.log("TITLE DATA:", {
    buildingType,
    searchLocation,
    propertyType,
    isNearMe,
  });
  let title = "";

  // Default title (before Apply Filter)
  if (!filtersApplied) {
    // Plot/Land
  if (propertyType2?.includes("Plot/Land")) {
    return searchLocation
      ? `Plot/Land For Sale/Rent in ${searchLocation}`
      : "Plot/Land For Sale/Rent";
  }
    // Custom page titles (Featured, Recommended, Verified, etc.)
    if (pageTitle) {
      return searchLocation
        ? `${pageTitle} in ${searchLocation}`
        : pageTitle;
    }

    // Advisor Dashboard
    switch (postedBy) {
      case "Owner":
        return "Properties Posted by Owner";

      case "Builder":
        return "Properties Posted by Builder";

      case "Buy":
        return searchLocation
          ? `Properties For Sale in ${searchLocation}`
          : "Properties For Sale";

      case "Rent":
        return searchLocation
          ? `Properties For Rent in ${searchLocation}`
          : "Properties For Rent";

      case "Commercial Buy":
        return searchLocation
          ? `Commercial Properties For Sale in ${searchLocation}`
          : "Commercial Properties For Sale";

      case "Commercial Lease":
        return searchLocation
          ? `Commercial Properties For Lease in ${searchLocation}`
          : "Commercial Properties For Lease";

      case "PG/Co-living":
        return searchLocation
          ? `PG/Co-living in ${searchLocation}`
          : "PG/Co-living";

      default:
        break;
    }
// Near Me + Property Type
if (isNearMe && buildingType === "Commercial") {
  return "Commercial Properties Near Me";
}

if (isNearMe && buildingType === "Residential") {
  return "Residential Properties Near Me";
}
    // Building Type
    if (buildingType === "Commercial") {
      return searchLocation
        ? `Commercial Properties in ${searchLocation}`
        : "Commercial Properties";
    }

    if (buildingType === "Residential") {
      return searchLocation
        ? `Residential Properties in ${searchLocation}`
        : "Residential Properties";
    }

    // Property Category
    switch (propertyType) {
      case "Buy":
        return searchLocation
          ? `Properties For Sale in ${searchLocation}`
          : "Properties For Sale";

      case "Rent":
        return searchLocation
          ? `Properties For Rent in ${searchLocation}`
          : "Properties For Rent";

      case "Commercial Buy":
        return searchLocation
          ? `Commercial Properties For Sale in ${searchLocation}`
          : "Commercial Properties For Sale";

      case "Commercial Lease":
        return searchLocation
          ? `Commercial Properties For Lease in ${searchLocation}`
          : "Commercial Properties For Lease";

      case "PG/Co-living":
        return searchLocation
          ? `PG/Co-living in ${searchLocation}`
          : "PG/Co-living";

      default:
        return searchLocation
          ? `Properties in ${searchLocation}`
          : "Properties";
    }
  }

  // Title after Apply Filter
if (bhkType) {
    title += bhkType;
  }

  if (propertyType2?.length > 0) {
    title += ` ${propertyType2[0]}`;
  }

  switch (propertyType) {
    case "Buy":
      title += " For Sale";
      break;

    case "Rent":
      title += " For Rent";
      break;

    case "Commercial Buy":
      title += " For Sale";
      break;

    case "Commercial Lease":
      title += " For Lease";
      break;

    default:
      break;
  }

  if (searchLocation) {
    title += ` in ${searchLocation}`;
  }

  return title.trim() || pageTitle || "Properties";
};