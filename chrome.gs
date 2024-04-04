function getChromeVer() {
  const spreadsheetId = SpreadsheetApp.getActiveSpreadsheet().getId();
  const dbSheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName('chromeVer確認');
  const url = dbSheet.getRange(2,3).getValue();
  const url_sorce = UrlFetchApp.fetch(url).getContentText();
  const searchValue = url_sorce.match(/(?<=<div class="drop-head">).*(?=<\/div>)/);//<div class="drop-head">最終更新日: 2022 年 6 月 24 日</div>
  const select = dbSheet.getRange(2,3).getNextDataCell(SpreadsheetApp.Direction.DOWN);//(https://moripro.net/gas-get-specified-lastcol-lastrow/)
  const selectValue = select.getDisplayValue();
  const selectRow = select.getRow();

  let now = new Date();
  let time = Utilities.formatDate(now, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');
  if(selectValue !== searchValue[0]){
    const inputValues = [["",searchValue[0],"",time]];
    dbSheet.getRange(selectRow+1, 2, 1, 4).setValues(inputValues);

    const fallback = 'Chrome Education リリースノートが更新されたことを検知しました。';
    const attachmentColor = '#e95295';
    const channel = '#os-update';
    const text = `
    Chrome Education リリースノートが更新されたことを検知しました。
      ${searchValue[0]}
      参照URL：https://support.google.com/chrome/a/answer/7679408
    `;
    const userName = "Chrome Education リリースノート";
    const iconType = 'icon_url';
    const icon = 'https://play-lh.googleusercontent.com/KwUBNPbMTk9jDXYS2AeX3illtVRTkrKVh5xR1Mg4WHd0CG2tV4mrh1z3kXi5z_warlk';
    toSlackMeseege(channel,fallback,attachmentColor,text,userName,iconType,icon);
    
  }else{
    dbSheet.getRange(selectRow, 6).setValue(time);
  };  
}
