function omikujishow(){
    var omikuji = ["大吉","中吉","小吉","凶"];

    var number1 = Math.random();
    var number2 = number1 * 4;
    var number = Math.floor(number2);
    var message = omikuji[number];

    var object = document.getElementById("omikuji");
    object.innerText = message;
    var object = document.getElementById("button");
    object.innerText = "もう一度引きなおす";
}