const express = require("express");
const route = express.Router();
const meetingModel = require("../../models/ZoomModel/ZoomModule");

const meetingController = require("../../controller/ZoomController/meetingController");
const googlemeetController = require("../../controller/ZoomController/googlemeetController");
const microsoftTeamMeeting = require("../../controller/ZoomController/microsoftTeamMeeting");
const { ZoomMeeting } = require("../../controller/ZoomController/zoomMeeting");

route.post("/meeting", ZoomMeeting);

route.post("/time", meetingController.time);

// route.post("/google-meeting", googlemeetController.googleMeeting);

route.post("/microsoftTeam-meeting", microsoftTeamMeeting.microsoftTeamMeeting);

route.post("/save-summary", (req, res) => {
  console.log("HEADERS:", req.headers);
  console.log("BODY:", req.body);

  res.status(200).json({ message: "Summary saved successfully" });
  res.send("Summary saved successfully");
});

module.exports = route;
