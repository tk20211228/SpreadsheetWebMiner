function googlePlaySupport() {
  const spreadsheetId = SpreadsheetApp.getActiveSpreadsheet().getId();
  const dbSheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName('Google システム アップデート確認');
  const url = dbSheet.getRange(2,3).getValue();
  const url_sorce = UrlFetchApp.fetch(url).getContentText();
  const searchValue = url_sorce.match(/(?<=<p><sup>\[1] ).*(?=<\/sup><br>)/);
  const select = dbSheet.getRange(2,3).getNextDataCell(SpreadsheetApp.Direction.DOWN);
  const selectValue = select.getDisplayValue();
  const selectRow = select.getRow();

  let now = new Date();
  let time = Utilities.formatDate(now, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');
  if(selectValue !== searchValue[0]){
    const inputValues = [["",searchValue[0],"",time]];
    dbSheet.getRange(selectRow+1, 2, 1, 4).setValues(inputValues);

    const fallback = '「Google システム アップデートの最新情報」が更新されたことを検知しました。';
    const attachmentColor = '#9ACCB3';
    const channel = '#os-update';//'DCBTFTETV';//クボキのみ
    // const channel = 'DCBTFTETV';//'';//クボキのみ
    const text = `
    「Google システム アップデートの最新情報」が更新されたことを検知しました。
     [内容] : ${searchValue[0]}
      参照URL : https://support.google.com/product-documentation/answer/11412553
    `;
    const userName = "Google システム アップデート";
    const iconType = 'icon_url';
    const icon = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_Play_2022_icon.svg/512px-Google_Play_2022_icon.svg.png';
    toSlackMeseege(channel,fallback,attachmentColor,text,userName,iconType,icon);
    
  }else{
    dbSheet.getRange(selectRow, 6).setValue(time);
  };
}
