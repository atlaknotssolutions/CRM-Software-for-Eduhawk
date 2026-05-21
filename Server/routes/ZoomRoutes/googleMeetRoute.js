const express = require("express");
const router = express.Router();

const {
  createCalendarEvent,
} = require("../../controller/ZoomController/googlemeetController");
const { getAuthUrl, getToken } = require("../../utils/gooleAuth");

// Step 1: Login with Google
router.get("/auth", (req, res) => {
  const url = getAuthUrl();
  res.redirect(url);
});

// Step 2: OAuth callback (MATCHES GOOGLE REDIRECT URI)
router.get("/authCallback", async (req, res) => {
  try {
    const code = req.query.code;

    const tokens = await getToken(code);

    console.log("Google Tokens:", tokens);

    res.send("Google authentication successful! Now you can create meetings.");
  } catch (error) {
    console.error(error);

    res.status(500).send("Authentication failed");
  }
});

// Step 3: Create Google Meet Meeting
router.post("/create-meeting", async (req, res) => {
  const { summary, description, startDateTime, endDateTime, attendees } =
    req.body;

  try {
    const event = await createCalendarEvent({
      summary,
      description,
      startDateTime,
      endDateTime,
      attendeesEmails: attendees,
    });

    res.json({
      success: true,
      meetLink: event.hangoutLink,
      event,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
  
});

module.exports = router;
