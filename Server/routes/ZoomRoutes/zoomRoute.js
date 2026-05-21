const express = require("express");
const route = express.Router();


const { createMeeting } = require("../../controller/ZoomController/zoomMeetingController")

route.post("/create", createMeeting);

module.exports = route;