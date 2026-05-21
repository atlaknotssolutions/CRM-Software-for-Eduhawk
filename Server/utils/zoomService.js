const axios = require("axios")

async function createZoomMeeting(topic, startTime) {

  const tokenRes = await axios.post(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
    {},
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
        ).toString("base64")}`
      }
    }
  )

  const accessToken = tokenRes.data.access_token
  const meeting = await axios.post(
    "https://api.zoom.us/v2/users/me/meetings",
    {
      topic,
      type: 2,
      start_time: `${startTime}:00`,
      duration: 60,
      timezone: "Asia/Kolkata",
      settings: {
        host_video: "true",
        join_before_host: "false",
        mute_upon_entry: "false",
        audio: "voip",
        auto_recording: "cloud"
      }
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  )

  return meeting.data.join_url
}

module.exports = createZoomMeeting