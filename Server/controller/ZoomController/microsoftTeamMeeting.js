const axios = require("axios");

const microsoftTeamMeeting = async (req, res) => {

  const { TENANT_ID, CLIENT_ID, CLIENT_SECRET, ORGANIZER_EMAIL } = process.env;

  async function getAccessToken() {
    try {
      const response = await axios.post(
        `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
        new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          scope: "https://graph.microsoft.com/.default",
          grant_type: "client_credentials"
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      return response.data.access_token;

    } catch (error) {
      console.error("Error getting access token:", error.response?.data || error.message);
      throw error;
    }
  }
  

  try {
    const { subject, startTime, endTime } = req.body;

    if (!subject || !startTime || !endTime) {
      return res.status(400).json({ error: "subject, startTime, and endTime are required" });
    }

    const st = new Date(startTime).toISOString();
    const et = new Date(endTime).toISOString();

    const token = await getAccessToken();
    

    const meetingResponse = await axios.post(
      `https://graph.microsoft.com/v1.0/users/${ORGANIZER_EMAIL}/onlineMeetings`,
      {
        startDateTime: st,
        endDateTime: et,
        subject: subject
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      joinUrl: meetingResponse.data.joinWebUrl,
      meetingId: meetingResponse.data.id,
      expiresAt: endTime
    });
    

  } catch (error) {
    console.error("Error creating meeting:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to create meeting" });
  }
};

module.exports = { microsoftTeamMeeting };
