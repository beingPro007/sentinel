import { asynchandler } from "@/lib/asyncHandler";
import axios from "axios";

async function fetchUserProfile() {
    const response = await axios.get('https://api.upstox.com/v2/user/profile', {
        headers: { 'Accept': 'application/json' },
        maxBodyLength: Infinity,
    });
    return response.data;
};

export default fetchUserProfile;
