// Centralizes API URL configuration for frontend requests and assets.
const API_BASE_URL = process.env.REACT_APP_API_URL || "";

// Builds backend asset URLs; receives a path and returns a fully qualified or same-origin URL.
const getApiAssetUrl = (path) => `${API_BASE_URL}${path}`;

export { API_BASE_URL, getApiAssetUrl };
