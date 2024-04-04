function openCheck() {
  var html = HtmlService.createHtmlOutputFromFile('proplist')
    .setWidth(600)
    .setHeight(360);
  SpreadsheetApp.getUi().showModelessDialog(html, '設定済みプロパティ一覧'); 
}
function inputMyprop() {
  const userEmail = Session.getActiveUser().getEmail();
  // const myName = getMyname();
  const myFirstName = getProp(userEmail);
  // console.log(myFirstName)
  let myLastName = getProp(myFirstName);
  if(!myLastName){
    myLastName = "";
  }else{
    myLastName = getProp(myFirstName).replace(myFirstName,"")
  }
  const myProp ={myFirstName,myLastName,userEmail};
  var output = HtmlService.createTemplateFromFile('propmydata')
    output.myProp = myProp // createTemplateFromFileは動的な内容（変数や条件文などサーバーサイドのJavaScriptコード）をHTMLに埋め込むことができる
  var html = output.evaluate()
    .setWidth(600)
    .setHeight(360);
  SpreadsheetApp.getUi().showModelessDialog(html, 'プロパティ 設定'); 
}

//プロパティをすべて削除する
function clearprop(){
  try{
    //スクリプトプロパティを削除する
    const prop = PropertiesService.getScriptProperties();
    prop.deleteAllProperties();

    //ユーザプロパティを削除する
    const prop2 = PropertiesService.getUserProperties();
    prop2.deleteAllProperties();

    return "OK";
  }catch(e){
    return "NG";
  }
}

//現在設定されてるスクリプトプロパティ一覧を取得する
function onProp(){
  //プロパティ値を一括取得
  const scriptProps = PropertiesService.getScriptProperties().getProperties();
  //vue用にデータを加工する
  var propdata = [];
  for (var key in scriptProps) {
    let temprop = {};
    temprop.propname = key;
    temprop.propvalue = scriptProps[key];
    temprop.proptype = "スクリプト";
    propdata.push(temprop);
    }

  const userProps = PropertiesService.getUserProperties().getProperties();
  for (var key in userProps) {
    //入れ物用意
    let temprop = {};
    temprop.propname = key;
    temprop.propvalue = userProps[key];
    temprop.proptype = "ユーザ";
    propdata.push(temprop);
  }
  
  return JSON.stringify(propdata);
}

//プロパティを一個削除する
function deleteman(item){
  var prop;
  switch(item.proptype){
    case "スクリプト":
      prop = PropertiesService.getScriptProperties();
      break;
    case "ユーザ":
      prop = PropertiesService.getUserProperties();
      break;
  }
  //プロパティを削除する
  var key = item.propname;
  prop.deleteProperty(key);

  return item.propname + "を削除しました。";
}

//プロパティの新規追加
function oninsert(recman){
  //プロパティタイプを取得
  var ptype = recman.proptype;
  var prop;
  if(ptype == 0){
    prop = PropertiesService.getScriptProperties();
  }else{
    prop = PropertiesService.getUserProperties();
  }
  //プロパティをセット
  try{
    prop.setProperty(recman.propname,recman.propvalue);
    return "OK";
  }catch(e){
    return "NG";
  }
}

function setMyprop({firstName,lastName,email}){
  try{
    const fullName = firstName+lastName;
    const propType =  PropertiesService.getScriptProperties();
    propType.setProperty(firstName,fullName);
    propType.setProperty(email,firstName);
    return true;
    }catch(e){
      return e.message;
    }
}



