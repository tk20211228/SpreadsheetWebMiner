function toSlackMeseege(channel,fallback,attachmentColor,text,userName,iconType,icon) {
  if(!iconType){
    var iconType = 'icon_emoji';
    var icon = ':office_worker:';
  }
        var postData = {
          'channel': channel,
          'token': '',
          // 'icon_url' : "https://www.jmas.co.jp/support/images/FAQ/icon_kaito_browser.png",
          // 'icon_emoji' : ':office_worker:',
          // 'icon_url' : icon_url,
          // 'text': message,
          [iconType] : `${icon}`,
          // [iconType] : [icon],
          // [iconType] : ':office_worker:',
          'attachments': [
              {
                //参考文献：https://tmg0525.hatenadiary.jp/entry/2017/10/15/120336
                //必須項目。要約メッセージを指定する。通知やモバイル端末での表示に使われる
                "fallback": fallback,
                //(ほぼ)必須項目。左のラインの色を設定する。Slackで用意されているgood、warning、dangerの３つを指定するか、カラーコード(#2E64FE)を指定する。
                "color": attachmentColor,
                //オプション項目。アタッチメントブロック(左に線が引いてある部分)の上に表示する文//
                // "pretext": message,
                //authorパラメータを設定すると、著者につい手の情報をアタッチメント内の上部に小さく表示する
                //著者名のテキスト
                // "author_name": "Bobby Tables",
                //author_nameにリンクを付ける。ユーザーが存在する場合のみ有効になる。
                // "author_link": "http://flickr.com/bobby/",
                //author_nameの左側に16x16のアイコンを表示するためのURL。ユーザーが存在する場合のみ有効になる。
                // "author_icon": "http://flickr.com/icons/bobby.jpg",
                //アタッチメントボックスの先頭に太字で表示される文字。
                // "title": "Slack API Documentation",
                //有効なURLを指定すると、titleがハイパーリンクになる。
                // "title_link": "https://api.slack.com/",
                //メインテキスト。700字以上か5行以上のテキストの場合には自動的に折りたたまれる。また、標準のマークアップが使える。
                "text": text,
                //
                // "fields": [
                //     {
                //       //valueの上に太字で見出しとして表示される。マークアップを含むことはできず、エスケープ処理がされる(Macでは表示されたが、iPhoneのアプリでは絵文字が表示されなかった)。
                //       "title": "Priority",
                //       //テキスト。標準のメッセージマークアップが使える。
                //       "value": "High",
                //       //valueを横に並べられるときには横に並べる。true、falseのどちらか。
                //       "short": false
                //     }
                //   ],
                // "image_url": "http://my-website.com/path/to/image.jpg",
                // "thumb_url": "http://example.com/path/to/thumb.png",
                // "footer": "Slack API",
                // "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
                // "ts": 123456789
              }
            ],

          "link_names" : 0,
          "unfurl_links" : false,//https://qiita.com/tiger_t/items/70d4b30eea46838234f4
          "username" : userName
          }
        var postData = JSON.stringify(postData);
        var options = {
          "method" : "POST",
          "payload" : postData,
          }
        const scriptProperties = PropertiesService.getScriptProperties();
        const propData = scriptProperties.getProperties();
        const url = propData["slack-api-key"];
        UrlFetchApp.fetch(url, options);
}
