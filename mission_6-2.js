var time = 30;
var score = 0;
var currentPokemon = "";
var succeed = [];
var pokemonList = [];
var timer;

var maxRecord = getCookie("maxRecord") || 0; // cookie に保存された最高記録を取得。なければ 0 を返す


// ページが読み込まれたときに最高記録と成功したポケモンの名前を cookie から取得
window.onload = function() {
    document.getElementById("high-score1").textContent = maxRecord;
    document.getElementById("high-score2").textContent = maxRecord;
    const savedSucceed = getCookie("succeed");
    if (savedSucceed) {
        succeed = JSON.parse(savedSucceed);
    }
};


// スタートボタンを押した時の処理
document.getElementById("start").onclick = function() {
    // スタート画面の要素を非表示にし、プレイ画面の要素を表示
    document.getElementById("introduction").style.display = "none";
    document.getElementById("game").style.display = "block";
    // ゲームスタート時にスコアとタイマーを初期化
    score = 0;
    time = 30;
    // 自動的に input にフォーカス
    document.getElementById("input").focus();
    startGame();
    // pokeapi からポケモンのデータを取得
    fetchPokemon();
};

// カウントダウンまわりの処理
function startGame() {
    timer = setInterval(function() {
        // time の値を 1 ずつ減らしていく
        time--;
        document.getElementById("time").textContent = time;
        // タイムが 0 になったら結果を表示
        if (time <= 0) {
            clearInterval(timer);
            showResult();
        }
    }, 1000); // 1000ms = 1s毎に処理を実行
}


// pokeapi からポケモンのデータを取得
async function fetchPokemon() {
    // 非同期処理のため、await を使ってデータを取得するまで待つ
    // id の若い順に 100 匹のポケモンのデータを取得
    const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=100");
    // あらかじめ作成した空の配列にポケモンのデータを格納
    pokemonList = response.data.results;
    showNextPokemon();
}

// fetchPokemon() で取得したデータからポケモンを表示
async function showNextPokemon() {
    // 乱数を用いてランダムに 1 匹のポケモンを選択
    var randomIndex = Math.floor(Math.random() * pokemonList.length);
    // 選択されたポケモンの url に対してリクエストを送り、結果を pokemonResponse に格納
    const pokemonResponse = await axios.get(pokemonList[randomIndex].url);

    // ポケモンの種別に関する詳細情報が含まれている species.url に対してリクエストを送り、結果を speciesResponse に格納
    const speciesUrl = pokemonResponse.data.species.url;
    // speciesURL を用いてポケモンの種別に関する詳細情報を取得
    const speciesResponse = await axios.get(speciesUrl);

    // ポケモンの名前を取得
    // speciesResponse.data.names には、複数の言語でのポケモンの名前がリストとして含まれている
    const names = speciesResponse.data.names;
    // find() を用いてリストから日本語名を取得
    const japaneseName = names.find((v) => v.language.name === "ja").name;
    currentPokemon = japaneseName;

    // ポケモンの画像を取得
    const imageUrl = pokemonResponse.data.sprites.front_default;

    // html に表示
    document.getElementById("pokemon-name").textContent = currentPokemon;
    document.getElementById("pokemon-image").src = imageUrl;
}

// 入力が正しければ次のポケモンを表示
document.getElementById("input").addEventListener("input", function() {
    // input に入力された値が currentPokemon と一致していれば、
    if (this.value === currentPokemon) {
        // 配列 succeed にポケモンの名前を追加して cookie に保存
        succeed.push(currentPokemon);
        setCookie("succeed", JSON.stringify(succeed));
        // 成功数を 1 増やして更新し、input の値を空にして次のポケモンを表示
        score++;
        document.getElementById("score").textContent = score;
        document.getElementById("input").value = "";
        showNextPokemon();
    }
});

// 結果を表示
function showResult() {
    // 入力途中でタイムアップになる可能性があるので、input の値を空にする処理を行う
    document.getElementById("input").value = "";
    // プレイ画面を非表示にし、結果画面を表示
    document.getElementById("game").style.display = "none";
    document.getElementById("result").style.display = "block";
    document.getElementById("final-score").textContent = score;

    // 最高記録を上回った場合はこれを更新する
    if (score > maxRecord) {
        maxRecord = score;
        document.getElementById("high-score1").textContent = maxRecord;
        document.getElementById("high-score2").textContent = maxRecord;
        setCookie("maxRecord", maxRecord); // cookie の最高記録も更新
    }
}

// cookie に 30 日間保存させる
function setCookie(name, value) {
    document.cookie = `${name}=${value}; max-age=${30 * 24 * 60 * 60}; path=/`;
}

// cookie から値を取得する
function getCookie(name) {
    return document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1] || null;
}

// もう一度遊ぶ場合は一旦スタート画面に戻る
document.getElementById("restart").onclick = function() {
    document.getElementById("result").style.display = "none";
    document.getElementById("introduction").style.display = "block";
    // 前回のゲームのスコアをリセット
    score = 0;
    document.getElementById("score").textContent = score;
};

// ポップアップを表示する
document.getElementById("show-popup").onclick = function() {
    document.getElementById("popup").style.display = "flex";
    // 成功したポケモンの名前をリスト表示
    document.getElementById("pokemon-list").innerHTML = succeed.map((name) => `<li>${name}</li>`).join("");
};

// ポップアップを閉じる
document.getElementById("close-popup").onclick = function() {
    document.getElementById("popup").style.display = "none";
};
