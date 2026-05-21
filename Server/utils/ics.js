const { createEvent } = require("ics");

const generateICS = (meeting) => {
  return new Promise((resolve, reject) => {
    createEvent(
      {
        title: meeting.topic,
        start: [2026, 2, 20, 10, 0], // dynamic bana sakte ho
        duration: { hours: 1 },
        description: `Join Zoom Meeting: ${meeting.join_url}`,
        location: meeting.join_url
      },
      (error, value) => {
        if (error) reject(error);
        resolve(value);
      }
    );
  });
};

module.exports = generateICS;