const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || 'dk56u1huz',
  api_key: process.env.API_KEY || '736884677361578',
  api_secret: process.env.API_SECRET || 'WlbAiSaUjOXBFZzZFWqJqwiAHcw',
});
module.exports = cloudinary;