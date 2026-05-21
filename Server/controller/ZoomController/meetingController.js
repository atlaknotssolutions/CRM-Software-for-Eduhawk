const getZoomAccessToken = require("./zoomAuth");
const axios = require("axios");
const nodemailer = require("nodemailer");
const meetingModel = require("../../models/ZoomModel/ZoomModule");
const { createEvent } = require("ics");

const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
);

oauth2Client.setCredentials({
  refresh_token: process.env.ADMIN_REFRESH_TOKEN
});


const calendar = google.calendar({
  version: "v3",
  auth: oauth2Client
});

// ⭐ CREATE GOOGLE CALENDAR EVENT
const createCalendarEvent = async ({ startTime, endTime, joinUrl }) => {
  const event = {
    summary: "Zoom Meeting",
    location: joinUrl,
    description: `Join Zoom Meeting: ${joinUrl}`,
    start: {
      dateTime: new Date(startTime).toISOString(),
      timeZone: "Asia/Kolkata"
    },
    end: {
      dateTime: new Date(endTime).toISOString(),
      timeZone: "Asia/Kolkata"
    },
    attendees: [
      { email: "ramboomxmedia02@gmail.com" },
    ]
  };

  const response = await calendar.events.insert({
    calendarId: "primary",
    resource: event,
    sendUpdates: "all"
  });

  console.log("Calendar event created:", response.data.id);
};

const meetingZoom = async (req,res)=>{
    const {startTime, endTime} = req.body;
    const ST = new Date(startTime).getTime();
    const ET = new Date(endTime).getTime();
    const duration = (ET - ST) / 60000;

    const ans = new Date(startTime).toISOString();
console.log(startTime);
console.log(ans);

 
// Validate input
    if ( !startTime || !endTime) {
      return res.status(400).json({ error: "startTime, and endTime are required" });
    }

    try {
       const token = await getZoomAccessToken();
       const meeting = await axios.post(
        "https://api.zoom.us/v2/users/ramboomxmedia02@gmail.com/meetings",
        {
            topic: "Test Meeting",
            type: 2,
            // start_time: new Date(startTime +  ":00+05:30"),
            start_time: startTime + ":00",
            duration:  duration ,
            // timezone: "Asia/Kolkata",
            timezone: "Asia/Calcutta",
            // created_at: new Date(startTime),
            settings:{
                  auto_recording: "cloud",
                //   meeting_invitees: [
                //   { email: "ramboomxmedia02@gmail.com" }
                // ],
                host_video: false,
                join_before_host: true,
                mute_upon_entry: false,
                waiting_room: false
            },
        }, 
        {
            headers:{
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
       );

        await createCalendarEvent({
      startTime,
      endTime,
      joinUrl: meeting.data.join_url
    });

      //  console.log(meeting.data);
   console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
    

       const meetingId = meeting.data.id;
       const delay = ET - Date.now(); // milliseconds to end
       
       const now = new Date();
       const meetingExpiry = new Date(endTime);
       if (now > meetingExpiry) {
    return res.status(410).json({ error: "Meeting link expired" });
  }

       if (delay > 0) {
  setTimeout(async () => {
    try {
      await axios.put(
        `https://api.zoom.us/v2/meetings/${meetingId}/status`,
        { action: "end" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Meeting ended, URLs now expired");
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  }, delay);
}


      
const generateICS = async(meeting) => {
  return new Promise((resolve, reject) => {
    const MeetingTime = new Date(startTime);
    createEvent(
      {
        title: "meeting",
        start: [MeetingTime.getFullYear(), MeetingTime.getMonth() + 1, MeetingTime.getDate(), MeetingTime.getHours(), MeetingTime.getMinutes()],
        duration: { hours: 1 },
        description: `Join Zoom Meeting: ${meeting.data.join_url}`,
        location: "Zoom Meeting Online",
      },
      (error, value) => {
        if (error) reject(error);
        resolve(value);
      }
    );
  });

//    const start = new Date(startTime);
//   const end = new Date(endTime);
//   return `
// BEGIN:VCALENDAR
// VERSION:2.0
// PRODID:-//Your App//EN
// METHOD:REQUEST
// BEGIN:VEVENT
// UID:${Date.now()}@yourapp.com
// DTSTAMP:${new Date().toISOString().replace(/[-:]/g,"").split(".")[0]}Z
// DTSTART:${start.toISOString().replace(/[-:]/g,"").split(".")[0]}Z
// DTEND:${end.toISOString().replace(/[-:]/g,"").split(".")[0]}Z
// SUMMARY:Zoom Meeting
// DESCRIPTION:Join Zoom Meeting: ${meeting.data.join_url}
// LOCATION:Online Zoom Meeting
// END:VEVENT
// END:VCALENDAR
// `;
};
      
      
  const transporterMail = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user:"rammaheshwari2022@gmail.com",
      pass:"gpvu lqvy knht vasj",
    }
  });

  await transporterMail.sendMail({
    from: "rammaheshwari2022@gmail.com",
    // to: "yarun4622@gmail.com",
    to: "rammaheshwari437@gmail.com",
    // to: "himanshudinkar43@gmail.com",
    subject: "Zoom Meeting Invite",
    text: `Please find attached meeting invite
           Join Zoom Meeting: ${meeting.data.join_url}
           Start Meeting : ${new Date(startTime)} `,
    alternatives: [
    {
       filename: "invite.ics",
      contentType: "text/calendar; method=REQUEST",
      content: await generateICS(meeting),
    },
  ],
  });

console.log("Email sent");


// const tldvLink = `https://tldv.io/meeting/${zoomMeetingId}`; // placeholder TL;DV link

// const newMeeting = new meetingModel({
//   topic: "Meeting",
//   start_time: new Date(startTime),
//   join_url: meeting.data.join_url,
//   zoom_meeting_id: meeting.data.id,
//   tldvLink: null,
// });

//        await newMeeting.save();

       res.json({
        join_url: meeting.data.join_url,
        start_url: meeting.data.start_url,
       })

    } catch (error) {
        console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to create meeting" });
    }
}






const time=async(req,res)=>{

    const {startTime, endTime} = req.body;
    const [h,m] = startTime.split(":")

    const now = new Date(); 
    const startDateTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    h,
    m
);



const isoStartTime = startDateTime.toISOString();
console.log(isoStartTime);
    
    
    
}





module.exports = {meetingZoom,time};