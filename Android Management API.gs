function dpc_release_notes() {
  const mine_sheet = SpreadsheetApp.openById('1Lw9yyM5-msOhgGCys0XuRw3VXGCR6Kg4DkSRxF753Dw').getSheetByName('Android Management API確認');
  const selectRange = mine_sheet.getRange(1,2,3,14);
  const searchword = selectRange.getValues();

  const url = searchword[1][1];
  const url_sorce = UrlFetchApp.fetch(url).getContentText();
  const mine_Parser = Parser.data(url_sorce);
  //リリースノート上で、リリース内容が”expanded”しているものを取得
  const search_Parser  = mine_Parser.from('<section  class="expandable expanded"').to('</section>').iterate();
  const new_search_Parser = [];
  for(var i = 0; i<search_Parser.length; i++){
    new_search_Parser.push(search_Parser[i])
     }

  //letとconst(https://tcd-theme.com/2021/04/javascript-let-const.html?gclid=Cj0KCQjwnueFBhChARIsAPu3YkT9eJvtucclIma7_TiOVvo5TvfBtUjvKhOI_WIuObB1ICVEYxn1ZwkaAjO6EALw_wcB)
  let titles = [];
  let contents_row = [];
  let contents = [];
  let times = [];
  let times2 = [];
  let now = new Date();
  let time = Utilities.formatDate(now, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');
  for (let i = 0; i < new_search_Parser.length; i++) {
    // let title = search_Parser_sub.from('<h2 class="showalways" id=').to('</h2>').iterate() ;//<h2 class="showalways" id=.*?">
    //タイトル
     var myRegexp = /<h2 class="showalways" id=.*?h2>/;
     var myRegexp1 = /<h2 class="showalways" id=.*?>/;
     var title0 = new_search_Parser[i].match(myRegexp);
     var title = title0[0].replace(myRegexp1,'').replace('</h2>','')
     titles.push(title);

     //内容
     var bb1_1 = search_Parser[i].match(/<h3[\s\S]*?<\/ul>[^.]*$/).join( '' );
     //箇条書き設定
     var bb1_2 = bb1_1.replace(/<h3.*?">/g,'<h3>■ ').replace(/<li>/g,'<li>・ ').replace(/<\/h3>[\s\S].*?<ul>[\s\S].*?<li>・/g,'<li>◆').
     replace(/<\/.*?>[\s\S].*?<\/ul>[\s\S].*?<li>・/g,'<li>◆').replace(/"warning">/g,'"warning">【注意】 ').replace(/<\/h3>/g,'._</h3>').replace(/<\/ul>|<ul>/g, '');
     var bb1 = bb1_2.match(/>[\s\S]*?</g ).join( '' ).replace(/  /g, '').replace(/[<>]/g, '');
     var bb2 = bb1.replace(/\. |\.  /g, '\.').replace(/\n/g, '');
     var bb0 = bb2.replace(/\._/g, '\n').replace(/\.・/g, '.\n   ・').replace(/\.■/g, '.\n■').replace(/◆/g, '\n ◆').replace(/\.【注意】/g, '.\n【注意】').replace(/_/g, '.');//空白は（TABキー）
     var bb3 = title + '\n' + bb0
     contents_row.push(bb3);
     //英語から日本語へ翻訳
     var bb = LanguageApp.translate(bb3, 'en', 'ja')
     contents.push(bb);
    //取得タイム
    times.push(time);
    times2.push([time]);

    }   
  const select1 = mine_sheet.getRange(2,2).getNextDataCell(SpreadsheetApp.Direction.DOWN);//(https://moripro.net/gas-get-specified-lastcol-lastrow/)
  // const select1Value = select1.getDisplayValue();
  const select1Row = select1.getRow();
  //シート上の表＞題名をすべて取得し、タイトルリストを比較、シート上に記載されていないものを記録する。
  //シート上の表＞題名をすべて取得
  const search_Values = mine_sheet.getRange(3,2,select1Row-2,1).getValues().flat();
  //タイトルリストを二次元配列から1次元配列にする。//参考URL（https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q12121821667）
  var titles_new1 = titles.filter(function(e){return search_Values.indexOf(e) == -1});
  //シート上の表＞内容をすべて取得し、タイトルリストを比較、シート上に記載されていないものを記録する。
  //シート上の表＞内容をすべて取得
  const search_content_Range = mine_sheet.getRange(3,4,select1Row-2,1);
  const search_content_Values = search_content_Range.getValues().flat();
  //タイトルリストを二次元配列から1次元配列にする。//参考URL（https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q12121821667）
  // const titles_new = Array.prototype.concat.apply([], titles)
  // const contents_new = 
  var contents_new1 = contents_row.filter(function(e){return search_content_Values.indexOf(e) == -1});
  const titles1 = [];
  const contents1 = [];
  const contents_row1 = [];
  const times1 = [];
    //未記載タイトルであれば、以下を実行
  for(i = 0 ; i < titles_new1.length ; i++){
      idx = titles.indexOf(titles_new1[i]);
      titles1.push([titles[idx]]);
      contents1.push([contents[idx]]);
      contents_row1.push([contents_row[idx]]);
      times1.push([time]);
    }
  
  //未記載タイトルが0個以外なら、以下を実行
  if(titles_new1.length !== 0){
    mine_sheet.getRange(select1Row+1, 2, titles1.length, 1).setValues(titles1);
    mine_sheet.getRange(select1Row+1, 3, contents1.length, 1).setValues(contents1);
    mine_sheet.getRange(select1Row+1, 4, contents_row1.length, 1).setValues(contents_row1);
    mine_sheet.getRange(select1Row+1, 5, times1.length, 1).setValues(times1);
    var slack_titles = [];
  for(var i=0; i<contents1.length; i++){
    slack_titles.push('\n'+'----------------------------------------\n '+contents1[i])
  }

    const scriptProperties = PropertiesService.getScriptProperties();
    const propData = scriptProperties.getProperties();
    const WebHook = propData["slack-api-key-dpc"];//（https://my.slack.com/services/new/incoming-webhook/）
    // 送信するSlackのテキスト
    var slackText = searchword[0][1]+"が更新されたことを検知しました。\n" +"※過去に確認したリリースノートのタイトル、内容が変更され検知した可能性もあります。"+ '\n' +
          "【リーリス内容】" +
           slack_titles +
           '\n'+'----------------------------------------'+
          '\n\n\n 以下サイトをご確認ください。\n'+

    searchword[1][1]+'\n'+
    '詳細な更新日時は、以下スプレッドシートをご参考ください。\n'+
    searchword[1][4];
    Logger.log('確認2  :  ' + slackText); 
    var Send = {
      "method": "post",
      "contentType" : "application/json",
      "payload": JSON.stringify({
        "channel": "#os-update",   // 通知したいチャンネル 設定しなくてもよい
        'icon_url' : "https://play-lh.googleusercontent.com/yv2FTUK7eKV9ZEvdIiMjmruq42wu2cgCgkygTeqkZGn_Y50MEaqlTx3tlYmTvVuo9mY",
        "text": slackText,
        "link_names" : 1,
        "username" : "Android Management API Release notes 更新確認 [Ver1.0]"
        })
    };
    UrlFetchApp.fetch(WebHook, Send);
  
  }else if(contents_new1.length !== 0){
    //未記載内容であれば、以下を実行
    for(i = 0 ; i < contents_new1.length ; i++){
      idx = contents_row.indexOf(contents_new1[i]);
      titles1.push([titles[idx]]);
      contents1.push([contents[idx]]);
      contents_row1.push([contents_row[idx]]);
      times1.push([time]);
    }
    mine_sheet.getRange(select1Row+1, 2, titles1.length, 1).setValues(titles1);
    mine_sheet.getRange(select1Row+1, 3, contents1.length, 1).setValues(contents1);
    mine_sheet.getRange(select1Row+1, 4, contents_row1.length, 1).setValues(contents_row1);
    mine_sheet.getRange(select1Row+1, 5, times1.length, 1).setValues(times1);
       var slack_titles = [];
          for(var i=0; i<contents1.length; i++){
            slack_titles.push('\n'+'----------------------------------------\n '+contents1[i])
          }
        const scriptProperties = PropertiesService.getScriptProperties();
        const propData = scriptProperties.getProperties();
        const WebHook = propData["slack-api-key-dpc"];//（https://my.slack.com/services/new/incoming-webhook/）
    // 送信するSlackのテキスト
    var slackText = searchword[0][1]+"が更新されたことを検知しました。\n" +"※過去に確認したリリースノートのタイトル、内容が変更され検知した可能性もあります。"+ '\n' +
          "【リーリス内容】" +
           slack_titles +
           '\n'+'----------------------------------------'+
          '\n\n\n 以下サイトをご確認ください。\n'+

    searchword[1][1]+'\n'+
    '詳細な更新日時は、以下スプレッドシートをご参考ください。\n'+
    searchword[1][4];
    Logger.log('確認2  :  ' + slackText); 
    var Send = {
      "method": "post",
      "contentType" : "application/json",
      "payload": JSON.stringify({
        "channel": "#os-update",   // 通知したいチャンネル 設定しなくてもよい
        'icon_url' : "https://play-lh.googleusercontent.com/yv2FTUK7eKV9ZEvdIiMjmruq42wu2cgCgkygTeqkZGn_Y50MEaqlTx3tlYmTvVuo9mY",
        "text": slackText,
        "link_names" : 1,
        "username" : "Android Management API Release notes 更新確認 [Ver1.0]"
        })
    };
    UrlFetchApp.fetch(WebHook, Send);

  }else{
    //取得しデータを、表のD列と比較して変更確認日時を記録する。
    for(i=0; i<contents_row.length; i++){
      idx = search_content_Values.indexOf(contents_row[i]);
      mine_sheet.getRange(idx+3,6).setValue(time);

    }
    
  }
  
}

