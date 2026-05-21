const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
  topic: String,
  start_time: String,
  join_url: String,
  zoom_meeting_id: String,
  tldvLink: String,
});

module.exports = mongoose.model("zoommeeting", MeetingSchema);