function datetimeshow(){
    var datetime = new Date();
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1;
    var day = datetime.getDate();
    var hour = datetime.getHours();
    var minute = datetime.getMinutes();
    var second = datetime.getSeconds();
    ans = year + "年" + month + "月" + day + "日" + hour + "時" + minute + "分" + second + "秒";
    var object = document.getElementById("datetime");
    object.innerText = ans;
}