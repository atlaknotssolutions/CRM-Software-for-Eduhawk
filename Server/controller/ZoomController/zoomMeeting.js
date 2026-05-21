const getZoomAccessToken = require("./zoomAuth");
const axios = require("axios");


const ZoomMeeting=async(req,res)=>{
    const {startTime , endTime} = req.body;
    const ST = new Date(startTime).getTime();
    const ET = new Date(endTime).getTime();
    const duration = (ET - ST) / 60000;

    if(!startTime || !endTime){
        return res.status(400).json({error:"startTime and endTime are required"});
    }
    
    try {
        const token = await getZoomAccessToken();
        const meeting = await axios.post(
            "https://api.zoom.us/v2/users/ramboomxmedia02@gmail.com/meetings",
            {
                topic: "Test Meeting",
                type: 2,
                start_time: startTime + ":00",
                duration: duration,
                timezone: "Asia/Kolkata",
                settings: {
                    host_video: "true",
                    join_before_host: "false",
                    mute_upon_entry: "false",
                    audio: "voip",
                    auto_recording: "cloud"
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            }
        );

        const data = meeting.data;
        res.status(200).json(data);
        console.log("Meeting Created");
    } catch (error) {
        console.log(error);
        
        
    }

}

module.exports={ZoomMeeting}