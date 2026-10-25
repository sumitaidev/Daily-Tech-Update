![image](https://i.ibb.co/3989ZPhq/Screenshot-2026-10-25-at-6-59-30-PM.png)



# Tech News Daily Morning ☕📰

An automated serverless project built with Google Apps Script that fetches the latest technology news from the TechCrunch RSS feed and delivers a beautifully styled, easy-to-read summary email to your inbox every morning.

## 🌟 Features
* **Automated Daily Delivery:** Runs automatically every morning (8:00 AM) using Google Apps Script's Time-Driven Triggers (Cloud Scheduler).
* **Rich UI/UX:** Delivers a modern, card-based HTML email design that looks great on both desktop and mobile.
* **Smart Image Extraction:** Automatically pulls high-quality thumbnails directly from TechCrunch's XML tags (`<media:content>` and `<content:encoded>`).
* **Zero Cost & Serverless:** Completely free to run using your Google account. No external servers or paid APIs required.

## 🏗️ Architecture
Based on the project flow:
1. **Cloud Scheduler (Time-Driven Trigger)** wakes up the Apps Script daily.
2. **Apps Script** acts as the central engine, making an HTTP Request to the **TechCrunch RSS Feed**.
3. **Data Retrieval** fetches and parses the XML feed to extract titles, links, dates, and thumbnails.
4. **Gmail API** receives the compiled HTML and dispatches the newsletter to the configured email address.

## 🚀 Setup Instructions

Follow these simple steps to set up the automation on your own Google Account:

1. **Create the Project:**
   * Go to [Google Apps Script](https://script.google.com/) and click **New Project**.
   * Rename the project to `Tech News Daily Morning`.

2. **Add the Code:**
   * Delete any default code in the `Code.gs` file.
   * Copy the JavaScript code provided in this project and paste it into the editor.

3. **Configure Your Settings:**
   At the top of the script, ensure the `RECIPIENT_EMAIL` variable is set to your email:
   ```javascript
   const RSS_FEED_URL = "[https://techcrunch.com/feed/](https://techcrunch.com/feed/)"; 
   const RECIPIENT_EMAIL = "sumit.csjournal@gmail.com"; // Your email here  
   const EMAIL_SUBJECT = "📰 Your Daily Tech Morning Update";)
