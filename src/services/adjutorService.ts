import axios from "axios";
import { AppError } from "../utils/AppError";

export const checkKarmaBlacklist = async (email: string) => {
  try {
    const response = await axios.get(
      `https://adjutor.lendsqr.com/v2/verification/karma/${email}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.ADJUTOR_API_KEY}`,
        },
      },
    ); 

    // Lendsqr Test Mode Handle: Allow bypassing so you can test your app locally
    if (response.data && response.data["mock-response"]) {
      return true;
    }

    // Live Mode Handle: If identity is actually found on the blacklist
    if (response.data && response.data.status === "success") {
      throw new AppError(
        "Onboarding denied: User is blacklisted on Lendsqr Karma",
        403,
      );
    }
  } catch (error: any) {
    // If we threw the 403 AppError above, re-throw it so the controller catches it.
    if (error.statusCode === 403) {
      throw error;
    }

    // A 404 means the user is clean (NOT blacklisted), which is exactly what we want!
    if (error.response && error.response.status === 404) {
      return true;
    }

    // Catch-all for network issues
  
    throw new AppError(
      "Service temporarily unavailable while verifying identity",
      502,
    );
  }
};
