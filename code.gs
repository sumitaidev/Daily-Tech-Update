// ==========================================
// CONFIGURATION
// ==========================================
const RSS_FEED_URL = "https://techcrunch.com/feed/"; 
const RECIPIENT_EMAIL = "sumit.csjournal@gmail.com";    
const EMAIL_SUBJECT = "📰 Your Daily Tech Morning Update";

/**
 * Main function to fetch RSS data and send a styled email with thumbnails.
 */
function fetchAndSendTechNews() {
  try {
    const response = UrlFetchApp.fetch(RSS_FEED_URL);
    const xml = response.getContentText();
    const document = XmlService.parse(xml);
    const root = document.getRootElement();
    const channel = root.getChild('channel');
    const items = channel.getChildren('item');
    
    // Namespaces used by TechCrunch and other standard RSS feeds
    const mediaNs = XmlService.getNamespace('media', 'http://search.yahoo.com/mrss/');
    const contentNs = XmlService.getNamespace('content', 'http://purl.org/rss/1.0/modules/content/');
    
    let emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background-color: #f8f9fa; padding: 25px; border-radius: 10px;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #e9ecef; margin-bottom: 20px;">
          <h2 style="color: #2c3e50; margin: 0; font-size: 24px;">Daily Tech Update</h2>
          <p style="color: #7f8c8d; font-size: 14px; margin-top: 5px;">Top stories from TechCrunch</p>
        </div>
    `;
    
    const maxItems = Math.min(items.length, 7);
    for (let i = 0; i < maxItems; i++) {
      const item = items[i];
      const title = item.getChildText('title');
      const link = item.getChildText('link');
      let pubDate = item.getChildText('pubDate');
      const description = item.getChildText('description');
      const contentEncoded = item.getChildText('encoded', contentNs);
      
      // Clean up timezone formatting
      if (pubDate) {
        pubDate = pubDate.replace(" +0000", "").replace(" GMT", "");
      }
      
      // Image Extraction Logic (Optimized for TechCrunch)
      let imageUrl = "https://via.placeholder.com/130x100?text=TechCrunch"; // Fallback
      
      // 1. Check for standard media tags
      const mediaContent = item.getChild('content', mediaNs) || item.getChild('thumbnail', mediaNs);
      if (mediaContent && mediaContent.getAttribute('url')) {
        imageUrl = mediaContent.getAttribute('url').getValue();
      } 
      // 2. Check inside <content:encoded> (Where TechCrunch often hides full-res images)
      else if (contentEncoded) {
        const imgMatch = contentEncoded.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch && imgMatch[1]) {
          imageUrl = imgMatch[1];
        }
      }
      // 3. Fallback to standard description HTML
      else if (description) {
        const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch && imgMatch[1]) {
          imageUrl = imgMatch[1];
        }
      }
      
      // Email-safe Table Layout for Thumbnail + Text
      emailHtml += `
        <div style="background: #ffffff; padding: 15px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid #3498db; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="130" valign="top" style="padding-right: 15px;">
                <a href="${link}" target="_blank">
                  <img src="${imageUrl}" alt="News Thumbnail" width="130" style="width: 130px; height: 90px; border-radius: 5px; display: block; object-fit: cover;">
                </a>
              </td>
              <td valign="top">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; line-height: 1.4;">
                  <a href="${link}" target="_blank" style="color: #2980b9; text-decoration: none;">${title}</a>
                </h3>
                <p style="margin: 0; font-size: 12px; color: #95a5a6;">${pubDate}</p>
              </td>
            </tr>
          </table>
        </div>`;
    }
    
    emailHtml += `
        <div style="text-align: center; margin-top: 25px; font-size: 12px; color: #bdc3c7;">
          <p>Automated via Google Apps Script</p>
        </div>
      </div>`;
    
    GmailApp.sendEmail(RECIPIENT_EMAIL, EMAIL_SUBJECT, "", {
      htmlBody: emailHtml
    });
    
    Logger.log("Email with TechCrunch thumbnails sent successfully!");
    
  } catch (error) {
    Logger.log("Error fetching or sending news: " + error.toString());
  }
}

/**
 * Creates a time-driven trigger to run the script every morning.
 */
function setupDailyMorningTrigger() {
  const functionName = 'fetchAndSendTechNews';
  
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === functionName) {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  
  ScriptApp.newTrigger(functionName)
    .timeBased()
    .everyDays(1)
    .atHour(8) 
    .create();
    
  Logger.log("Daily morning trigger successfully configured.");
}
