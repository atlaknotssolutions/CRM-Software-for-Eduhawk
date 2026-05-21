const axios = require("axios");

const getZoomAccessToken = async () => {
    try {
        const res = await axios.post(
            `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
            {},
            {
                auth: {
                    username: process.env.ZOOM_CLIENT_ID,
                    password: process.env.ZOOM_CLIENT_SECRET,
                },
            }
        );
        return res.data.access_token;
    } catch (error) {
        console.error("Error fetching Zoom token:", error.response?.data || error.message);
        throw error;
    }
};

module.exports = getZoomAccessToken;
