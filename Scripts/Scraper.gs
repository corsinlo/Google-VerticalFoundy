function onOpen() {
  var spreadsheet = SpreadsheetApp.getActive();
  var menuItems = [
    {name: 'Scrape Link', functionName: 'gDirveDataCollector'},
  ]; 
  spreadsheet.addMenu('Menu', menuItems);
}

function gDirveDataCollector (){
  var ui = SpreadsheetApp.getUi();
  var result = ui.prompt("Paste the ID of Google Drive Folder");
  var gDriveFolderID = result.getResponseText();

  var ui = SpreadsheetApp.getUi();
  var result = ui.prompt("Enter Folder Name for Tab:");
  var sheetTabName  = result.getResponseText();

  SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetTabName);

  var newSheet = SpreadsheetApp.getActive().getSheetByName(sheetTabName);
  newSheet.getRange("A1").setValue("Doc Title");
  newSheet.getRange("B1").setValue("Location ID");
  newSheet.getRange("C1").setValue("Link");
   newSheet.getRange("D1").setValue("Folder");
  newSheet.getRange("E1").setValue("Owner");
  newSheet.getRange("F1").setValue("go/link");

  var folder = DriveApp.getFolderById(gDriveFolderID);
  var contents = folder.getFiles();

  var output = new Array();
  var i = 0;

  while(contents.hasNext()) {
    file = contents.next();
    output[i] = new Array(5);
    output[i][0] = file.getName();
    output[i][1] = file.getId();
    output[i][2] = file.getUrl();
    output[i][3] = "https://drive.google.com/corp/drive/u/0/folders/"+ gDriveFolderID;
    output[i][4] = file.getOwner().getEmail();
    i++;     
  }

  var contents = folder.getFolders();
  while(contents.hasNext()) {
    file = contents.next();
    output[i] = new Array(5);
    output[i][0] = file.getName();
    output[i][1] = file.getId();
    output[i][2] = file.getUrl();
    output[i][3] = "https://drive.google.com/corp/drive/u/0/folders/"+ gDriveFolderID;
    output[i][4] = file.getOwner().getEmail();
    i++;     
  }

  newSheet.getRange(2,1,output.length,5).setValues(output);
}
