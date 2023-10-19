import jwtDecode from "jwt-decode";

// Function to check if a JWT is valid (not expired)
function isTokenValid(token) {
  if (!token) {
    // Token doesn't exist
    return false;
  }

  try {
    // Decode the JWT to access its claims, including 'exp' (expiration time)
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert current time to seconds

    // Check if the current time is before the expiration time
    if (decoded.exp > currentTime) {
      return true;
    } else {
      localStorage.clear();
      return false;
    }
  } catch (error) {
    // Token is invalid or cannot be decoded
    return false;
  }
}

export function getJwt() {
  const jwt = localStorage.getItem("jwt");
  const isTokenStillValid = isTokenValid(jwt);
  if (isTokenStillValid) {
    return jwt;
  }
  return null;
}
