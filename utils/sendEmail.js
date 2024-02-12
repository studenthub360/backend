import { SendMailClient } from "zeptomail";
// import { getenv } from "../../core/helper.js";
import axios from "axios"; 

const url = "api.zeptomail.com/";
const token = process.env.ZEPTO_API_KEY
// console.log("token: "+ token)

export function sendMail(email, subject, htmlbody) {
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

    return 
}

export async function sendEmailUsingTemplate(templateAlias, recipientEmail, data, name) {
  // console.log("here now")
  const ZEPTO_API_KEY = process.env.ZEPTO_API_KEY
  const url = 'https://api.zeptomail.com/v1.1/email/template'
  const sender_name = name || "noreply@studenthub360.software"

  const headers = {
    'Authorization': ZEPTO_API_KEY,
    'Content-Type': 'application/json',
  };

const payload = {

  "template_alias":templateAlias,
  "from": {
    "address": "noreply@studenthub360.software",
    "name": sender_name,
  },
  "to": [
      {
      "email_address": {
        "address":recipientEmail
          }
      }
  ],
  "merge_info": 
      data
  
}
  try {
    const response = await axios.post(url, payload, { headers });
    // console.log(response)
    return response.data;
  } catch (error) {
    // console.log(error.response.data.error.details)
    // console.log(error.response.data.error.details)
    throw error;
  }
}