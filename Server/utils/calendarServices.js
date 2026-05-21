// // const { createEvent } = require("ics")

// // function generateICS(title, startDate, meetingLink) {

// //   return new Promise((resolve, reject) => {

// //     const event = {
// //       title: title,
// //       start: startDate,
// //       duration: { hours: 1 },
// //       description: "Zoom Meeting",
// //       location: meetingLink
// //     }
    

// //     createEvent(event, (error, value) => {

// //       if (error) reject(error)

// //       resolve(value)

// //     })
// //   })
// // }

// // module.exports = generateICS

// const { google } = require("googleapis")

// const oauth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   process.env.GOOGLE_REDIRECT_URI
// )

// oauth2Client.setCredentials({
//   refresh_token: process.env.ADMIN_REFRESH_TOKEN
// })

// async function calendar(title, startTime, meetingLink) {

//   const start = new Date(startTime)

//   if (isNaN(start)) {
//     throw new Error("Invalid startTime format")
//   }

//   const end = new Date(start.getTime() + 60 * 60 * 1000)

//   const calendarAPI = google.calendar({
//     version: "v3",
//     auth: oauth2Client
//   })

//   const event = {
//     summary: title,
//     description: `Zoom Meeting: ${meetingLink}`,
//     location: meetingLink,
//     start: {
//       dateTime: start.toISOString(),
//       timeZone: "Asia/Kolkata"
//     },
//     end: {
//       dateTime: end.toISOString(),
//       timeZone: "Asia/Kolkata"
//     },
//     conferenceData: { // Google Meet Link
//       createRequest: { requestId: `meet-${Date.now()}` }
//     }
//   }

//   const response = await calendarAPI.events.insert({
//     calendarId: "primary",
//     resource: event,
//     conferenceDataVersion: 1, // must be 1 to create Meet
//     sendUpdates: "all"
//   })

//   return response.data
// }

// module.exports = { calendar }







function generateICS(title, startTime, meetingLink) {
  const start = new Date(startTime)
  const end = new Date(start.getTime() + 60 * 60 * 1000) // 1 hour

  const formatDate = (date) =>
    date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"

  return `
BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${Date.now()}@yourdomain.com
SUMMARY:${title}
DTSTART:${formatDate(start)}
DTEND:${formatDate(end)}
DESCRIPTION:Join Zoom Meeting: ${meetingLink}
LOCATION:${meetingLink}
ORGANIZER;CN=Host:mailto:youremail@example.com
END:VEVENT
END:VCALENDAR
`
}

module.exports = { generateICS }