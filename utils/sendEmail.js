const { SendMailClient } = require("zeptomail");
const axios = require("axios");

const url = "api.zeptomail.com/";
const token = process.env.ZEPTO_API_KEY;

function sendMail(email, subject, htmlbody) {
  let client = new SendMailClient({ url, token });

  client
    .sendMail({
      from: {
        address: "noreply@studenthub360.software",
        name: "noreply@studenthub360.software",
      },
      to: [
        {
          email_address: {
            address: email,
          },
        },
      ],
      subject: subject,
      htmlbody: htmlbody,
    })
    .then((resp) => console.log("success"))
    .catch((error) => console.log(error));
}

async function sendEmailUsingTemplate(templateAlias, recipientEmail, data, name) {
  const ZEPTO_API_KEY = process.env.ZEPTO_API_KEY || 'wSsVR61+8xejWK8smWKlJOw7mlkEUlj/Rhkri1Gg4yD/SqzB9MdqlUHHB1SvHfIeEzVpETVErb0vnxpWgWUPjNgvywoJDSiF9mqRe1U4J3x17qnvhDzDX25blRGPJIsLxAlommVlFs8m+g==';
  const url = 'https://api.zeptomail.com/v1.1/email/template';
  const sender_name = name || "noreply@studenthub360.software";

  const headers = {
    'Authorization': ZEPTO_API_KEY,
    'Content-Type': 'application/json',
  };

  const payload = {
    "template_alias": templateAlias,
    "from": {
      "address": "noreply@studenthub360.software",
      "name": sender_name,
    },
    "to": [
      {
        "email_address": {
          "address": recipientEmail
        }
      }
    ],
    "merge_info": data
  };

  try {
    const response = await axios.post(url, payload, { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
}

module.exports = { sendMail, sendEmailUsingTemplate };
