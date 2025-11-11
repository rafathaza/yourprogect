
/**
 * Google Apps Script - Web App endpoint to collect requests into a Google Sheet.
 * 1) Create a Google Sheet and note its ID.
 * 2) Tools > Script editor (Apps Script), paste this file as Code.gs
 * 3) Replace SHEET_ID with your sheet's ID.
 * 4) Deploy > New deployment > Type: Web app > Execute as: Me > Who has access: Anyone with link
 * 5) Copy the Web App URL and paste it into config.js as SHEETS_WEB_APP_URL.
 */
const SHEET_ID = 'REPLACE_WITH_YOUR_SHEET_ID';
const SHEET_NAME = 'Requests';

function doPost(e) {
  try{
    const body = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    // header
    if(sh.getLastRow()===0){
      sh.appendRow(['Timestamp','Pain','BusinessType','Name','Org','Phone','Email','Raw']);
    }
    sh.appendRow([new Date(), (body.pain||[]).join(', '), body.btype||'', body.name||'', body.org||'', body.phone||'', body.email||'', JSON.stringify(body)]);
    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  }catch(err){
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err)})).setMimeType(ContentService.MimeType.JSON);
  }
}
