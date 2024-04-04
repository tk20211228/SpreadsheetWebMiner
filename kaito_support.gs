function kaitoSupport() {
  const spreadsheetId = SpreadsheetApp.getActiveSpreadsheet().getId();
  const dbSheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName('KAITO_サポートサイト確認');
  const url = dbSheet.getRange(2,3).getValue();
  const url_sorce = UrlFetchApp.fetch(url).getContentText();
  const searchValue = url_sorce.match(/(?<=target="_blank">).*(?=<\/a><\/li>)/);//<div class="drop-head">最終更新日: 2022 年 6 月 24 日</div>
  //シート＞題名＞B列最終行値取得、行の位置取得
  const select = dbSheet.getRange(2,3).getNextDataCell(SpreadsheetApp.Direction.DOWN);//(https://moripro.net/gas-get-specified-lastcol-lastrow/)
  const selectValue = select.getDisplayValue();
  const selectRow = select.getRow();
  let now = new Date();
  let time = Utilities.formatDate(now, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');
  if(selectValue !== searchValue[0]){
    const inputValues = [["",searchValue[0],"",time]];
    dbSheet.getRange(selectRow+1, 2, 1, 4).setValues(inputValues);

    const fallback = 'KAITOのお客様サポートが更新されたことを検知しました。';
    const attachmentColor = '#0072bc';
    const channel = '#os-update';
    const text = `
    KAITOのお客様サポートが更新されたことを検知しました。
      ${searchValue[0]}
      参照URL：https://www.jmas.co.jp/support/
    `;
    const userName = "KAITO　お客様サポート";
    const iconType = 'icon_url';
    const icon = 'https://www.jmas.co.jp/support/images/FAQ/icon_kaito_browser.png';
    toSlackMeseege(channel,fallback,attachmentColor,text,userName,iconType,icon);
    }else{
      dbSheet.getRange(selectRow, 6).setValue(time);
    };
}
