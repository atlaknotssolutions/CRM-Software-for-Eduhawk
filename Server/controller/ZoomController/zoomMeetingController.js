const createZoomMeeting = require("../../utils/zoomService"); 
const sendEmail = require("../../utils/emailServices");
// const createCalendarEvent = require("../services/emailServices");
const createCalendarEvent = require("../../utils/emailServices");


exports.createMeeting = async (req, res) => {
  const { email, topic, startTime } = req.body

  console.log(startTime);

  // Zoom meeting create
  const zoomLink = await createZoomMeeting(topic, startTime)

  // Send email with .ics (auto-add to Google Calendar)
  // await sendEmail(email, topic, startTime, zoomLink)
  await createCalendarEvent ( topic, startTime, zoomLink, email)

  res.json({
    message: "Meeting invite sent",
    zoomLink
  })
}