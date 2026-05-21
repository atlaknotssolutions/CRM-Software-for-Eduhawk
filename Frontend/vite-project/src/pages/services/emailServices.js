// const nodemailer = require("nodemailer")

// async function sendEmail(email, topic, startTime, zoomLink) {

//   const start = new Date(startTime)
//   const end = new Date(start.getTime() + 60 * 60 * 1000)

//   const formatDate = (date) =>
//     date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"

//   const icsContent = `
// BEGIN:VCALENDAR
// VERSION:2.0
// CALSCALE:GREGORIAN
// METHOD:REQUEST
// BEGIN:VEVENT
// SUMMARY:${topic}
// DTSTART:${formatDate(start)}
// DTEND:${formatDate(end)}
// DESCRIPTION:Zoom Meeting
// LOCATION:${zoomLink}
// END:VEVENT
// END:VCALENDAR
// `

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "rammaheshwari2022@gmail.com",
//       pass: "gpvu lqvy knht vasj"
//     }
//   })

//   await transporter.sendMail({
//     from: "rammaheshwari2022@gmail.com",
//     to: email,
//     subject: topic,
//     text: `Join Zoom Meeting: ${zoomLink}`,
//     alternatives: [
//       {
//         contentType: "text/calendar",
//         content: icsContent
//       }
//     ]
//   })
// }

// module.exports = sendEmail







// const nodemailer = require("nodemailer")
// const { generateICS } = require("./calendarServices")

// async function sendEmail(email, topic, startTime, zoomLink) {
//   const icsContent = generateICS(topic, startTime, zoomLink)

//   const transporter = nodemailer.createTransport({
//     auth: {
//       user: process.env.GMAIL_USER,
//       pass: process.env.GMAIL_PASSWORD
//     }
//   })

//   const gcalLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(topic)}&dates=${new Date(startTime).toISOString().replace(/[-:]/g,"").split(".")[0]}/${new Date(new Date(startTime).getTime()+60*60*1000).toISOString().replace(/[-:]/g,"").split(".")[0]}&details=${encodeURIComponent("Join Zoom: "+zoomLink)}&location=${encodeURIComponent(zoomLink)}`

//   await transporter.sendMail({
//     from: process.env.GMAIL_USER,
//     to: email,
//     subject: topic,
//     html: `
//       <p>Join Zoom Meeting: <a href="${zoomLink}">${zoomLink}</a></p>
//       <p><a href="${gcalLink}">Add to Google Calendar</a></p>
//     `,
//     alternatives: [
//       {
//         contentType: "text/calendar; method=PUBLISH",
//         content: icsContent
//       }
//     ]
//   })
// }

// module.exports = sendEmail


const { google } = require("googleapis")

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

oauth2Client.setCredentials({
  refresh_token: process.env.ADMIN_REFRESH_TOKEN
})

async function createCalendarEvent(title, startTime, zoomLink, attendeeEmail) {
  const start = new Date(startTime)
  const end = new Date(start.getTime() + 60*60*1000) // 1 hour

  const calendarAPI = google.calendar({ version: "v3", auth: oauth2Client })

  const event = {
    summary: title,
    description: `Join Zoom Meeting: ${zoomLink}`,
    location: zoomLink,
    start: { dateTime: start.toISOString(), timeZone: "Asia/Kolkata" },
    end: { dateTime: end.toISOString(), timeZone: "Asia/Kolkata" },
    attendees: [{ email: attendeeEmail }], // must be internal user
    // conferenceData removed → avoids Google Meet button
  }

  const response = await calendarAPI.events.insert({
    calendarId: "primary",
    resource: event,
    sendUpdates: "all" // pushes event directly to recipient's calendar
  })

  return response.data
}

module.exports = createCalendarEvent