// 参考URL
// https://officeforest.org/wp/2018/05/04/gas_webapi/#Basic%E8%AA%8D%E8%A8%BC%E3%82%B5%E3%82%A4%E3%83%88%E3%82%92%E9%96%8B%E3%81%8F

function mdm_announce_notes() {
  const mine_sheet = SpreadsheetApp.openById('1Lw9yyM5-msOhgGCys0XuRw3VXGCR6Kg4DkSRxF753Dw').getSheetByName('SDM_サポートサイト確認');
  const scriptProperties = PropertiesService.getScriptProperties();
  const propData = scriptProperties.getProperties();
  const mdmSupportId = propData["mdm-support-id"];
  const mdmSupportPass = propData["mdm-support-pass"];
  const mdmSupportUrl = propData["mdm-support-url"];

  let headers = { 
    "Authorization" : " Basic " + Utilities.base64Encode(mdmSupportId + ":" + mdmSupportPass),
    };
  let target_URL = mdmSupportUrl;
  let get_options = {
    method: "get",
    headers: headers,
    followRedirects: true,
  };
  const response = UrlFetchApp.fetch(target_URL, get_options);
  const url_sorce = response.getContentText();

  // 外部ライブラリを使用
  const mine_Parser = Parser.data(url_sorce);
  //アナウンス上で、内容が”expanded”しているものを取得
  const search_Parser  = mine_Parser.from('<div class="tag"><span class="').to(`</a></div>`).iterate();
  const tagName = search_Parser[0].match(/(?<=">).*(?=<\/span><\/div>)/);
  const tiltle = search_Parser[0].match(/(?<=\.html">).*/);

  //シート＞題名＞B列最終行値取得、行の位置取得
  const selectCell = mine_sheet.getRange(2,3).getNextDataCell(SpreadsheetApp.Direction.DOWN);//(https://moripro.net/gas-get-specified-lastcol-lastrow/)
  const selectCellValue = selectCell.getDisplayValue();
  const selectCellRow = selectCell.getRow();
  let now = new Date();
  let time = Utilities.formatDate(now, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');
  if(selectCellValue !== tiltle[0]){
    const inputValues = [[tagName,tiltle,"",time]];
    mine_sheet.getRange(selectCellRow+1, 2, 1, 4).setValues(inputValues);
    const fallback = 'サポートサイトが更新されたことを検知しました。';
    const attachmentColor = '#fd7e00';
    // const channel = 'DCBTFTETV';//kuboki-onlyのみ
    const channel = '#os-update';
    const text = `
    SDMサポートサイトが更新されたことを検知しました。
    【${tagName[0]}】
      ${tiltle[0]}
      参照URL: ${mdmSupportUrl} 
    `;
    const userName = "SDMサポートサイト";
    const iconType = 'icon_url';
    const icon = 'https://avatars.slack-edge.com/2020-10-13/1417790344230_26067e39e21faf215e70_72.png';
    toSlackMeseege(channel,fallback,attachmentColor,text,userName,iconType,icon);
  }else{
    mine_sheet.getRange(selectCellRow, 6).setValue(time);
  };

}








