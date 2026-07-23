"use strict";

/* =====================================
   データ
===================================== */

const STORAGE_KEY = "girlsbar_data";

let appData = {
    casts: [],
    slips: [],
    expenses: [],
    workHours: []
};

/* =====================================
   起動
===================================== */

window.onload = function () {

    loadData();

    showToday();

    updateDashboard();

};

/* =====================================
   保存
===================================== */

function saveData(){

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(appData)

    );

}

/* =====================================
   データ読み込み
===================================== */

function loadData(){

    const data = localStorage.getItem(STORAGE_KEY);

    if(data){

        try{

            const savedData = JSON.parse(data);

            appData = {

                casts:
                    Array.isArray(savedData.casts)
                    ? savedData.casts
                    : [],

                slips:
                    Array.isArray(savedData.slips)
                    ? savedData.slips
                    : [],

                expenses:
                    Array.isArray(savedData.expenses)
                    ? savedData.expenses
                    : [],

                workHours:
                    Array.isArray(savedData.workHours)
                    ? savedData.workHours
                    : []

            };

        }catch(error){

            console.error(
                "保存データの読み込みに失敗しました",
                error
            );

        }

    }

}

/* =====================================
   今日
===================================== */

function showToday(){

    document.getElementById("today").textContent =

    new Date().toLocaleDateString(

        "ja-JP",

        {

            year:"numeric",

            month:"long",

            day:"numeric"

        }

    );

}

/* =====================================
   金額表示
===================================== */

function money(value){

    return "¥"+

    Number(value)

    .toLocaleString();

}

/* =====================================
   ダッシュボード更新
===================================== */

function updateDashboard(){

    const today = getTodayDate();

    const todaySlips = appData.slips.filter(

        slip=>slip.date===today

    );

    const todayExpenses = appData.expenses.filter(

        expense=>expense.date===today

    );

    const sales = todaySlips.reduce(

        (total,slip)=>{

            return total + Number(slip.total || 0);

        },

        0

    );

    const expenses = todayExpenses.reduce(

        (total,expense)=>{

            return total + Number(expense.amount || 0);

        },

        0

    );

    const profit = sales-expenses;

    document.getElementById(
        "todaySales"
    ).textContent=money(sales);

    document.getElementById(
        "todayExpense"
    ).textContent=money(expenses);

    document.getElementById(
        "todayProfit"
    ).textContent=money(profit);

    document.getElementById(
        "todaySlipCount"
    ).textContent=todaySlips.length+"件";

}

/* =====================================
   キャスト設定
===================================== */

function showCastSettings(){

    const content =

    document.getElementById(

        "content"

    );

    content.innerHTML=`

    <div class="panel">

        <h2>

            キャスト設定

        </h2>

        <label>

            名前

            <input

                id="castName"

                type="text"

            >

        </label>

        <label>

            時給

            <input

                id="hourly"

                type="number"

                value="2000"

            >

        </label>

        <label>

            ドリンクバック

            <input

                id="drinkBack"

                type="number"

                value="200"

            >

        </label>

        <label>

            指名バック

            <input

                id="nominationBack"

                type="number"

                value="500"

            >

        </label>

        <label>

            延長バック

            <input

                id="extensionBack"

                type="number"

                value="300"

            >

        </label>

        <label>

            ポンパバック

            <input

                id="pompaBack"

                type="number"

                value="500"

            >

        </label>

        <label>

            マバムバック

            <input

                id="mavamBack"

                type="number"

                value="1000"

            >

        </label>

        <label>

            ソウメイバック

            <input

                id="soumeiBack"

                type="number"

                value="3000"

            >

        </label>

        <button

            class="saveButton"

            onclick="saveCast()"

        >

            キャスト登録

        </button>

        <hr

        style="margin:25px 0;">

        <div

            id="castList">

        </div>

    </div>

    `;

    renderCastList();

}

/* =====================================
   キャスト登録
===================================== */

function saveCast(){

    const name = document.getElementById("castName").value.trim();

    if(name===""){

        alert("名前を入力してください");

        return;

    }

    appData.casts.push({

        id:Date.now(),

        name:name,

        hourly:Number(document.getElementById("hourly").value),

        drinkBack:Number(document.getElementById("drinkBack").value),

        nominationBack:Number(document.getElementById("nominationBack").value),

        extensionBack:Number(document.getElementById("extensionBack").value),

        pompaBack:Number(document.getElementById("pompaBack").value),

        mavamBack:Number(document.getElementById("mavamBack").value),

        soumeiBack:Number(document.getElementById("soumeiBack").value)

    });

    saveData();

    document.getElementById("castName").value="";

    renderCastList();

}

/* =====================================
   キャスト一覧
===================================== */

function renderCastList(){

    const list = document.getElementById("castList");

    if(appData.casts.length===0){

        list.innerHTML = `

        <div class="empty">

            キャストはまだ登録されていません

        </div>

        `;

        return;

    }

    let html="";

    appData.casts.forEach(cast=>{

        html += `

        <div class="listCard">

            <h3>${cast.name}</h3>

            <div class="row">

                <span>時給</span>

                <strong>${money(cast.hourly)}</strong>

            </div>

            <div class="row">

                <span>ドリンクバック</span>

                <strong>${money(cast.drinkBack)}</strong>

            </div>

            <div class="row">

                <span>指名バック</span>

                <strong>${money(cast.nominationBack)}</strong>

            </div>

            <div class="row">

                <span>延長バック</span>

                <strong>${money(cast.extensionBack)}</strong>

            </div>

            <div class="row">

                <span>ポンパバック</span>

                <strong>${money(cast.pompaBack)}</strong>

            </div>

            <div class="row">

                <span>マバムバック</span>

                <strong>${money(cast.mavamBack)}</strong>

            </div>

            <div class="row">

                <span>ソウメイバック</span>

                <strong>${money(cast.soumeiBack)}</strong>

            </div>

            <div style="margin-top:15px;display:flex;gap:10px;">

                <button
                    class="saveButton"
                    onclick="editCast(${cast.id})">

                    編集

                </button>

                <button
                    class="deleteButton"
                    onclick="deleteCast(${cast.id})">

                    削除

                </button>

            </div>

        </div>

        `;

    });

    list.innerHTML = html;

}

/* =====================================
   キャスト削除
===================================== */

function deleteCast(id){

    if(!confirm("削除しますか？")){

        return;

    }

    appData.casts = appData.casts.filter(

        cast=>cast.id!==id

    );

    saveData();

    renderCastList();

}

/* =====================================
   キャスト編集
===================================== */

function editCast(id){

    const cast = appData.casts.find(

        item=>item.id===id

    );

    if(!cast){

        return;

    }

    document.getElementById("castName").value = cast.name;

    document.getElementById("hourly").value = cast.hourly;

    document.getElementById("drinkBack").value = cast.drinkBack;

    document.getElementById("nominationBack").value = cast.nominationBack;

    document.getElementById("extensionBack").value = cast.extensionBack;

    document.getElementById("pompaBack").value = cast.pompaBack;

    document.getElementById("mavamBack").value = cast.mavamBack;

    document.getElementById("soumeiBack").value = cast.soumeiBack;

    appData.casts = appData.casts.filter(

        item=>item.id!==id

    );

    saveData();

    renderCastList();

}

/* =====================================
   伝票入力画面
===================================== */

function showSlipForm(){

    const content = document.getElementById("content");

    content.innerHTML = `

    <div class="panel">

        <h2>🧾 伝票入力</h2>

        <label>

            日付

            <input
                id="slipDate"
                type="date"
                value="${getTodayDate()}">

        </label>

        <label>

            セット料金

            <input
                id="setPrice"
                type="number"
                value="4000">

        </label>

        <hr>

        <h3>🍹 ドリンク</h3>

        <div id="drinkArea"></div>

        <button
            class="addButton"
            onclick="addDrink()">

            ＋ドリンク追加

        </button>

        <hr>

        <h3>👑 指名</h3>

        <div id="nominationArea"></div>

        <button
            class="addButton"
            onclick="addNomination()">

            ＋指名追加

        </button>

        <hr>

        <h3>⏰ 延長</h3>

        <div id="extensionArea"></div>

        <button
            class="addButton"
            onclick="addExtension()">

            ＋延長追加

        </button>

        <hr>

        <h3>🍾 シャンパン</h3>

        <div id="champagneArea"></div>

        <button
            class="addButton"
            onclick="addChampagne()">

            ＋シャンパン追加

        </button>

        <div
            class="totalBox">

            <span>

                合計

            </span>

            <strong
                id="slipTotal">

                ¥4,000

            </strong>

        </div>

        <button
            class="saveButton"
            onclick="saveSlip()">

            保存

        </button>

    </div>

    `;

}

/* =====================================
   今日
===================================== */

function getTodayDate(){

    return new Date()

    .toISOString()

    .slice(0,10);

}

/* =====================================
   ドリンク追加
===================================== */

function addDrink(){

    const area = document.getElementById("drinkArea");

    let options = "";

    appData.casts.forEach(cast=>{

        options += `
            <option value="${cast.id}">
                ${cast.name}
            </option>
        `;

    });

    area.insertAdjacentHTML(

        "beforeend",

        `
        <div class="listCard drinkRow">

            <label>

                キャスト

                <select class="drinkCast">

                    ${options}

                </select>

            </label>

            <label>

                杯数

                <input
                    class="drinkCount"
                    type="number"
                    value="1"
                    min="1"
                    onchange="calculateSlip()">

            </label>

            <button
                class="deleteButton"
                onclick="removeRow(this)">

                削除

            </button>

        </div>
        `

    );

    calculateSlip();

}

/* =====================================
   行削除
===================================== */

function removeRow(button){

    button.parentElement.remove();

    calculateSlip();

}

/* =====================================
   合計計算
===================================== */

function calculateSlip(){

    let total = Number(
        document.getElementById("setPrice").value || 0
    );

    // ドリンク
    document.querySelectorAll(".drinkRow").forEach(row=>{

        const count = Number(
            row.querySelector(".drinkCount").value || 0
        );

        total += count * 1000;

    });

    // 指名
    document.querySelectorAll(".nominationRow").forEach(row=>{

        const count = Number(
            row.querySelector(".nominationCount").value || 0
        );

        total += count * 1000;

    });

    // 延長
    document.querySelectorAll(".extensionRow").forEach(row=>{

        const count = Number(
            row.querySelector(".extensionCount").value || 0
        );

        total += count * 0;

    });

    // シャンパン
    document.querySelectorAll(".champagneRow").forEach(row=>{

        const type =
        row.querySelector(".champagneType").value;

        const count = Number(
            row.querySelector(".champagneCount").value || 0
        );

        let price = 0;

        if(type==="ポンパ"){

            price = 10000;

        }

        if(type==="マバム"){

            price = 30000;

        }

        if(type==="ソウメイ"){

            price = 90000;

        }

        total += price * count;

    });

    document.getElementById("slipTotal").textContent = money(total);

}

/* =====================================
   セット料金変更
===================================== */

document.addEventListener(

    "input",

    function(event){

        if(event.target.id==="setPrice"){

            calculateSlip();

        }

    }

);

/* =====================================
   指名追加
===================================== */

function addNomination(){

    const area = document.getElementById("nominationArea");

    let options = "";

    appData.casts.forEach(cast=>{

        options += `
            <option value="${cast.id}">
                ${cast.name}
            </option>
        `;

    });

    area.insertAdjacentHTML(

        "beforeend",

        `
        <div class="listCard nominationRow">

            <label>

                キャスト

                <select class="nominationCast">

                    ${options}

                </select>

            </label>

            <label>

                指名本数

                <input
                    class="nominationCount"
                    type="number"
                    value="1"
                    min="1"
                    oninput="calculateSlip()">

            </label>

            <div class="row">

                <span>売上</span>

                <strong>1本 ¥1,000</strong>

            </div>

            <button
                type="button"
                class="deleteButton"
                onclick="removeRow(this)">

                削除

            </button>

        </div>
        `

    );

    calculateSlip();

}

/* =====================================
   延長追加
===================================== */

function addExtension(){

    const area = document.getElementById("extensionArea");

    let options = "";

    appData.casts.forEach(cast=>{

        options += `
            <option value="${cast.id}">
                ${cast.name}
            </option>
        `;

    });

    area.insertAdjacentHTML(

        "beforeend",

        `
        <div class="listCard extensionRow">

            <label>

                キャスト

                <select class="extensionCast">

                    ${options}

                </select>

            </label>

            <label>

                延長回数

                <input
                    class="extensionCount"
                    type="number"
                    value="1"
                    min="1"
                    oninput="calculateSlip()">

            </label>

            <div class="row">

                <span>売上</span>

                <strong>1回 ¥0</strong>

            </div>

            <button
                type="button"
                class="deleteButton"
                onclick="removeRow(this)">

                削除

            </button>

        </div>
        `

    );

    calculateSlip();

}

/* =====================================
   シャンパン追加
===================================== */

function addChampagne(){

    const area = document.getElementById("champagneArea");

    let castOptions = "";

    appData.casts.forEach(cast=>{

        castOptions += `
            <option value="${cast.id}">
                ${cast.name}
            </option>
        `;

    });

    area.insertAdjacentHTML(

        "beforeend",

        `
        <div class="listCard champagneRow">

            <label>

                キャスト

                <select class="champagneCast">

                    ${castOptions}

                </select>

            </label>

            <label>

                シャンパン

                <select
                    class="champagneType"
                    onchange="calculateSlip()">

                    <option value="ポンパ">

                        ポンパ ¥10,000

                    </option>

                    <option value="マバム">

                        マバム ¥30,000

                    </option>

                    <option value="ソウメイ">

                        ソウメイ ¥90,000

                    </option>

                </select>

            </label>

            <label>

                本数

                <input
                    class="champagneCount"
                    type="number"
                    value="1"
                    min="1"
                    oninput="calculateSlip()">

            </label>

            <button
                type="button"
                class="deleteButton"
                onclick="removeRow(this)">

                削除

            </button>

        </div>
        `

    );

    calculateSlip();

}

/* =====================================
   伝票保存
===================================== */

function saveSlip(){

    const date = document
        .getElementById("slipDate")
        .value;

    const setPrice = Number(
        document.getElementById("setPrice").value || 0
    );

    if(!date){

        alert("日付を選択してください");

        return;

    }

    if(setPrice < 0){

        alert("セット料金を正しく入力してください");

        return;

    }

    const drinks = collectDrinkRows();

    const nominations = collectNominationRows();

    const extensions = collectExtensionRows();

    const champagnes = collectChampagneRows();

    const total =
        setPrice
        + calculateDrinkSales(drinks)
        + calculateNominationSales(nominations)
        + calculateChampagneSales(champagnes);

    const slip = {

        id: Date.now(),

        date: date,

        createdAt: new Date().toISOString(),

        setPrice: setPrice,

        drinks: drinks,

        nominations: nominations,

        extensions: extensions,

        champagnes: champagnes,

        total: total

    };

    appData.slips.push(slip);

    saveData();

    updateDashboard();

    alert(
        "伝票を保存しました\n合計：" + money(total)
    );

    showSlipForm();

}


/* =====================================
   ドリンク情報取得
===================================== */

function collectDrinkRows(){

    const drinks = [];

    document
        .querySelectorAll(".drinkRow")
        .forEach(row=>{

            const castId = Number(
                row.querySelector(".drinkCast").value
            );

            const count = Number(
                row.querySelector(".drinkCount").value || 0
            );

            if(castId && count > 0){

                drinks.push({

                    castId: castId,

                    count: count,

                    unitPrice: 1000,

                    sales: count * 1000

                });

            }

        });

    return drinks;

}


/* =====================================
   指名情報取得
===================================== */

function collectNominationRows(){

    const nominations = [];

    document
        .querySelectorAll(".nominationRow")
        .forEach(row=>{

            const castId = Number(
                row.querySelector(".nominationCast").value
            );

            const count = Number(
                row.querySelector(".nominationCount").value || 0
            );

            if(castId && count > 0){

                nominations.push({

                    castId: castId,

                    count: count,

                    unitPrice: 1000,

                    sales: count * 1000

                });

            }

        });

    return nominations;

}


/* =====================================
   延長情報取得
===================================== */

function collectExtensionRows(){

    const extensions = [];

    document
        .querySelectorAll(".extensionRow")
        .forEach(row=>{

            const castId = Number(
                row.querySelector(".extensionCast").value
            );

            const count = Number(
                row.querySelector(".extensionCount").value || 0
            );

            if(castId && count > 0){

                extensions.push({

                    castId: castId,

                    count: count,

                    unitPrice: 0,

                    sales: 0

                });

            }

        });

    return extensions;

}


/* =====================================
   シャンパン情報取得
===================================== */

function collectChampagneRows(){

    const champagnes = [];

    document
        .querySelectorAll(".champagneRow")
        .forEach(row=>{

            const castId = Number(
                row.querySelector(".champagneCast").value
            );

            const type =
                row.querySelector(".champagneType").value;

            const count = Number(
                row.querySelector(".champagneCount").value || 0
            );

            const price = getChampagnePrice(type);

            if(castId && type && count > 0){

                champagnes.push({

                    castId: castId,

                    type: type,

                    count: count,

                    unitPrice: price,

                    sales: price * count

                });

            }

        });

    return champagnes;

}


/* =====================================
   シャンパン価格取得
===================================== */

function getChampagnePrice(type){

    if(type === "ポンパ"){

        return 10000;

    }

    if(type === "マバム"){

        return 30000;

    }

    if(type === "ソウメイ"){

        return 90000;

    }

    return 0;

}


/* =====================================
   ドリンク売上計算
===================================== */

function calculateDrinkSales(drinks){

    return drinks.reduce(

        (total, drink)=>{

            return total + Number(drink.sales || 0);

        },

        0

    );

}


/* =====================================
   指名売上計算
===================================== */

function calculateNominationSales(nominations){

    return nominations.reduce(

        (total, nomination)=>{

            return total + Number(
                nomination.sales || 0
            );

        },

        0

    );

}


/* =====================================
   シャンパン売上計算
===================================== */

function calculateChampagneSales(champagnes){

    return champagnes.reduce(

        (total, champagne)=>{

            return total + Number(
                champagne.sales || 0
            );

        },

        0

    );

}

/* =====================================
   伝票一覧
===================================== */

function showSlipList(){

    const content = document.getElementById("content");

    if(appData.slips.length===0){

        content.innerHTML = `

        <div class="panel">

            <h2>📄 伝票一覧</h2>

            <div class="empty">

                伝票はまだありません

            </div>

        </div>

        `;

        return;

    }

    const slips = [...appData.slips]

        .sort((a,b)=>{

            if(a.date===b.date){

                return b.id-a.id;

            }

            return b.date.localeCompare(a.date);

        });

    let html = `

    <div class="panel">

        <h2>📄 伝票一覧</h2>

    `;

    let currentDate = "";

    slips.forEach(slip=>{

        if(currentDate!==slip.date){

            currentDate = slip.date;

            html += `

            <h3 style="
                margin-top:25px;
                margin-bottom:12px;
                padding-bottom:8px;
                border-bottom:2px solid #222;
            ">

                ${formatDateLabel(slip.date)}

            </h3>

            `;

        }

        html += renderSlipCard(slip);

    });

    html += `

    </div>

    `;

    content.innerHTML = html;

}


/* =====================================
   日付表示
===================================== */

function formatDateLabel(dateString){

    const date = new Date(dateString+"T00:00:00");

    return date.toLocaleDateString(

        "ja-JP",

        {

            year:"numeric",

            month:"long",

            day:"numeric",

            weekday:"short"

        }

    );

}


/* =====================================
   伝票カード表示
===================================== */

function renderSlipCard(slip){

    let detailHtml = "";

    detailHtml += `

    <div class="row">

        <span>セット料金</span>

        <strong>${money(slip.setPrice)}</strong>

    </div>

    `;

    slip.drinks.forEach(item=>{

        const cast = getCastById(item.castId);

        detailHtml += `

        <div class="row">

            <span>

                ドリンク
                (${cast ? cast.name : "削除済みキャスト"})
                × ${item.count}

            </span>

            <strong>

                ${money(item.sales)}

            </strong>

        </div>

        `;

    });

    slip.nominations.forEach(item=>{

        const cast = getCastById(item.castId);

        detailHtml += `

        <div class="row">

            <span>

                指名
                (${cast ? cast.name : "削除済みキャスト"})
                × ${item.count}

            </span>

            <strong>

                ${money(item.sales)}

            </strong>

        </div>

        `;

    });

    slip.extensions.forEach(item=>{

        const cast = getCastById(item.castId);

        detailHtml += `

        <div class="row">

            <span>

                延長
                (${cast ? cast.name : "削除済みキャスト"})
                × ${item.count}

            </span>

            <strong>

                ¥0

            </strong>

        </div>

        `;

    });

    slip.champagnes.forEach(item=>{

        const cast = getCastById(item.castId);

        detailHtml += `

        <div class="row">

            <span>

                ${item.type}
                (${cast ? cast.name : "削除済みキャスト"})
                × ${item.count}

            </span>

            <strong>

                ${money(item.sales)}

            </strong>

        </div>

        `;

    });

    return `

    <div class="listCard">

        <div class="row">

            <strong>

                伝票合計

            </strong>

            <strong style="font-size:22px;">

                ${money(slip.total)}

            </strong>

        </div>

        <hr style="margin:12px 0;">

        ${detailHtml}

        <button
            class="deleteButton"
            style="width:100%;margin-top:12px;"
            onclick="deleteSlip(${slip.id})">

            この伝票を削除

        </button>

    </div>

    `;

}


/* =====================================
   キャスト取得
===================================== */

function getCastById(id){

    return appData.casts.find(

        cast=>cast.id===id

    );

}


/* =====================================
   伝票削除
===================================== */

function deleteSlip(id){

    const slip = appData.slips.find(

        item=>item.id===id

    );

    if(!slip){

        alert("伝票が見つかりません");

        return;

    }

    const confirmed = confirm(

        formatDateLabel(slip.date)
        +"の伝票を削除しますか？\n"
        +"合計："+money(slip.total)

    );

    if(!confirmed){

        return;

    }

    appData.slips = appData.slips.filter(

        item=>item.id!==id

    );

    saveData();

    updateDashboard();

    showSlipList();

}

/* =====================================
   経費入力画面
===================================== */

function showExpenseForm(){

    const content = document.getElementById("content");

    content.innerHTML = `

    <div class="panel">

        <h2>💸 経費入力</h2>

        <label>
            日付

            <input
                id="expenseDate"
                type="date"
                value="${getTodayDate()}">
        </label>

        <label>
            経費内容

            <input
                id="expenseName"
                type="text"
                placeholder="例：酒の仕入れ、送迎代、雑費">
        </label>

        <label>
            金額

            <input
                id="expenseAmount"
                type="number"
                value="0"
                min="0">
        </label>

        <button
            class="saveButton"
            onclick="saveExpense()">

            経費を保存

        </button>

        <hr style="margin:25px 0;">

        <h2>経費一覧</h2>

        <div id="expenseList"></div>

    </div>

    `;

    renderExpenseList();

}


/* =====================================
   経費保存
===================================== */

function saveExpense(){

    const date =
        document.getElementById("expenseDate").value;

    const name =
        document.getElementById("expenseName").value.trim();

    const amount = Number(
        document.getElementById("expenseAmount").value || 0
    );

    if(!date){

        alert("日付を選択してください");

        return;

    }

    if(name===""){

        alert("経費内容を入力してください");

        return;

    }

    if(amount<=0){

        alert("金額を正しく入力してください");

        return;

    }

    appData.expenses.push({

        id:Date.now(),

        date:date,

        name:name,

        amount:amount,

        createdAt:new Date().toISOString()

    });

    saveData();

    updateDashboard();

    document.getElementById("expenseName").value="";

    document.getElementById("expenseAmount").value=0;

    renderExpenseList();

    alert("経費を保存しました");

}


/* =====================================
   経費一覧
===================================== */

function renderExpenseList(){

    const list =
        document.getElementById("expenseList");

    if(!list){

        return;

    }

    if(appData.expenses.length===0){

        list.innerHTML = `

        <div class="empty">

            経費はまだ登録されていません

        </div>

        `;

        return;

    }

    const expenses = [...appData.expenses].sort(

        (a,b)=>{

            if(a.date===b.date){

                return b.id-a.id;

            }

            return b.date.localeCompare(a.date);

        }

    );

    let html="";

    let currentDate="";

    expenses.forEach(expense=>{

        if(currentDate!==expense.date){

            currentDate=expense.date;

            html += `

            <h3 style="
                margin-top:20px;
                margin-bottom:10px;
                padding-bottom:8px;
                border-bottom:2px solid #222;
            ">

                ${formatDateLabel(expense.date)}

            </h3>

            `;

        }

        html += `

        <div class="listCard">

            <div class="row">

                <span>
                    ${expense.name}
                </span>

                <strong>
                    ${money(expense.amount)}
                </strong>

            </div>

            <button
                class="deleteButton"
                style="width:100%;margin-top:10px;"
                onclick="deleteExpense(${expense.id})">

                この経費を削除

            </button>

        </div>

        `;

    });

    list.innerHTML=html;

}


/* =====================================
   経費削除
===================================== */

function deleteExpense(id){

    const expense = appData.expenses.find(

        item=>item.id===id

    );

    if(!expense){

        alert("経費が見つかりません");

        return;

    }

    const confirmed = confirm(

        expense.name
        +" "
        +money(expense.amount)
        +"を削除しますか？"

    );

    if(!confirmed){

        return;

    }

    appData.expenses = appData.expenses.filter(

        item=>item.id!==id

    );

    saveData();

    updateDashboard();

    renderExpenseList();

}

/* =====================================
   日別集計
===================================== */

function showDailySummary(){

    const content = document.getElementById("content");

    let html = `

    <div class="panel">

        <h2>📅 日別集計</h2>

    `;

    const dates = [

        ...new Set(

            appData.slips.map(

                slip=>slip.date

            )

        )

    ].sort().reverse();

    if(dates.length===0){

        html += `

        <div class="empty">

            伝票がありません

        </div>

        `;

    }

    dates.forEach(date=>{

        const slips = appData.slips.filter(

            slip=>slip.date===date

        );

        const expenses = appData.expenses.filter(

            expense=>expense.date===date

        );

        const sales = slips.reduce(

            (t,s)=>t+s.total,

            0

        );

        const expense = expenses.reduce(

            (t,e)=>t+e.amount,

            0

        );

        const profit = sales-expense;

        html += `

        <div class="listCard">

            <h3>

                ${formatDateLabel(date)}

            </h3>

            <div class="row">

                <span>売上</span>

                <strong>${money(sales)}</strong>

            </div>

            <div class="row">

                <span>経費</span>

                <strong>${money(expense)}</strong>

            </div>

            <div class="row">

                <span>利益</span>

                <strong>${money(profit)}</strong>

            </div>

            <div class="row">

                <span>伝票件数</span>

                <strong>${slips.length}件</strong>

            </div>

        </div>

        `;

    });

    html += "</div>";

    content.innerHTML = html;

}

/* =====================================
   月別集計
===================================== */

function showMonthlySummary(){

    const content = document.getElementById("content");

    let html = `

    <div class="panel">

        <h2>📆 月別集計</h2>

    `;

    const months = [

        ...new Set(

            appData.slips.map(

                slip=>slip.date.substring(0,7)

            )

        )

    ].sort().reverse();

    if(months.length===0){

        html += `

        <div class="empty">

            データがありません

        </div>

        `;

    }

    months.forEach(month=>{

        const slips = appData.slips.filter(

            slip=>slip.date.startsWith(month)

        );

        const expenses = appData.expenses.filter(

            expense=>expense.date.startsWith(month)

        );

        const sales = slips.reduce(

            (t,s)=>t+s.total,

            0

        );

        const expense = expenses.reduce(

            (t,e)=>t+e.amount,

            0

        );

        const profit = sales-expense;

        html += `

        <div class="listCard">

            <h3>

                ${month}

            </h3>

            <div class="row">

                <span>売上</span>

                <strong>${money(sales)}</strong>

            </div>

            <div class="row">

                <span>経費</span>

                <strong>${money(expense)}</strong>

            </div>

            <div class="row">

                <span>利益</span>

                <strong>${money(profit)}</strong>

            </div>

            <div class="row">

                <span>伝票件数</span>

                <strong>${slips.length}件</strong>

            </div>

        </div>

        `;

    });

    html += "</div>";

    content.innerHTML = html;

}

/* =====================================
   勤務時間入力画面
===================================== */

function showWorkHoursForm(){

    const content =
        document.getElementById("content");

    if(appData.casts.length===0){

        content.innerHTML = `

        <div class="panel">

            <h2>⏰ 勤務時間入力</h2>

            <div class="empty">

                先にキャストを登録してください

            </div>

        </div>

        `;

        return;

    }

    let castOptions = "";

    appData.casts.forEach(cast=>{

        castOptions += `

        <option value="${cast.id}">

            ${cast.name}

        </option>

        `;

    });

    content.innerHTML = `

    <div class="panel">

        <h2>⏰ 勤務時間入力</h2>

        <label>

            日付

            <input
                id="workDate"
                type="date"
                value="${getTodayDate()}">

        </label>

        <label>

            キャスト

            <select id="workCast">

                ${castOptions}

            </select>

        </label>

        <label>

            勤務時間

            <input
                id="workHours"
                type="number"
                value="5"
                min="0"
                step="0.25">

        </label>

        <p style="
            color:#666;
            font-size:13px;
            margin-top:-8px;
            margin-bottom:15px;
        ">

            15分は0.25、30分は0.5、
            45分は0.75で入力

        </p>

        <button
            class="saveButton"
            onclick="saveWorkHours()">

            勤務時間を保存

        </button>

        <hr style="margin:25px 0;">

        <h2>勤務時間一覧</h2>

        <div id="workHoursList"></div>

    </div>

    `;

    renderWorkHoursList();

}


/* =====================================
   勤務時間保存
===================================== */

function saveWorkHours(){

    const date =
        document.getElementById("workDate").value;

    const castId = Number(
        document.getElementById("workCast").value
    );

    const hours = Number(
        document.getElementById("workHours").value
    );

    if(!date){

        alert("日付を選択してください");

        return;

    }

    if(!castId){

        alert("キャストを選択してください");

        return;

    }

    if(!Number.isFinite(hours) || hours<=0){

        alert("勤務時間を正しく入力してください");

        return;

    }

    /*
    同じ日・同じキャストの記録がある場合は
    新規追加ではなく上書き
    */

    const existing = appData.workHours.find(

        item=>
            item.date===date
            &&
            item.castId===castId

    );

    if(existing){

        existing.hours = hours;

        existing.updatedAt =
            new Date().toISOString();

    }else{

        appData.workHours.push({

            id:Date.now(),

            date:date,

            castId:castId,

            hours:hours,

            createdAt:
                new Date().toISOString()

        });

    }

    saveData();

    updateDashboard();

    renderWorkHoursList();

    alert("勤務時間を保存しました");

}


/* =====================================
   勤務時間一覧
===================================== */

function renderWorkHoursList(){

    const list =
        document.getElementById("workHoursList");

    if(!list){

        return;

    }

    if(appData.workHours.length===0){

        list.innerHTML = `

        <div class="empty">

            勤務時間はまだ登録されていません

        </div>

        `;

        return;

    }

    const records = [

        ...appData.workHours

    ].sort((a,b)=>{

        if(a.date===b.date){

            return b.id-a.id;

        }

        return b.date.localeCompare(a.date);

    });

    let html = "";

    let currentDate = "";

    records.forEach(record=>{

        const cast = getCastById(record.castId);

        if(currentDate!==record.date){

            currentDate = record.date;

            html += `

            <h3 style="
                margin-top:20px;
                margin-bottom:10px;
                padding-bottom:8px;
                border-bottom:2px solid #222;
            ">

                ${formatDateLabel(record.date)}

            </h3>

            `;

        }

        const hourly =
            Number(cast?.hourly || 0);

        const baseSalary =
            hourly * Number(record.hours || 0);

        html += `

        <div class="listCard">

            <h3>

                ${cast ? cast.name : "削除済みキャスト"}

            </h3>

            <div class="row">

                <span>勤務時間</span>

                <strong>

                    ${record.hours}時間

                </strong>

            </div>

            <div class="row">

                <span>時給</span>

                <strong>

                    ${money(hourly)}

                </strong>

            </div>

            <div class="row">

                <span>基本給</span>

                <strong>

                    ${money(baseSalary)}

                </strong>

            </div>

            <button
                class="deleteButton"
                style="width:100%;margin-top:10px;"
                onclick="deleteWorkHours(${record.id})">

                この勤務時間を削除

            </button>

        </div>

        `;

    });

    list.innerHTML = html;

}


/* =====================================
   勤務時間削除
===================================== */

function deleteWorkHours(id){

    const record = appData.workHours.find(

        item=>item.id===id

    );

    if(!record){

        alert("勤務時間が見つかりません");

        return;

    }

    const cast = getCastById(record.castId);

    const confirmed = confirm(

        formatDateLabel(record.date)
        +"の"
        +(cast ? cast.name : "キャスト")
        +"の勤務時間を削除しますか？"

    );

    if(!confirmed){

        return;

    }

    appData.workHours =
        appData.workHours.filter(

            item=>item.id!==id

        );

    saveData();

    updateDashboard();

    renderWorkHoursList();

}

/* =====================================
   キャスト別集計
===================================== */

function showCastSummary(){

    const content =
        document.getElementById("content");

    if(appData.casts.length===0){

        content.innerHTML = `

        <div class="panel">

            <h2>👑 キャスト別集計</h2>

            <div class="empty">

                キャストが登録されていません

            </div>

        </div>

        `;

        return;

    }

    content.innerHTML = `

    <div class="panel">

        <h2>👑 キャスト別集計</h2>

        <label>

            集計月

            <input
                id="castSummaryMonth"
                type="month"
                value="${getCurrentMonthValue()}"
                onchange="renderCastSummary()">

        </label>

        <div id="castSummaryList"></div>

    </div>

    `;

    renderCastSummary();

}


/* =====================================
   現在の年月
===================================== */

function getCurrentMonthValue(){

    return getTodayDate().substring(0,7);

}


/* =====================================
   キャスト集計表示
===================================== */

function renderCastSummary(){

    const month =
        document.getElementById(
            "castSummaryMonth"
        ).value;

    const list =
        document.getElementById(
            "castSummaryList"
        );

    if(!month || !list){

        return;

    }

    const monthSlips =
        appData.slips.filter(

            slip=>slip.date.startsWith(month)

        );

    const monthWorkHours =
        appData.workHours.filter(

            record=>record.date.startsWith(month)

        );

    let html = "";

    appData.casts.forEach(cast=>{

        let drinkCount = 0;

        let nominationCount = 0;

        let extensionCount = 0;

        let pompaCount = 0;

        let mavamCount = 0;

        let soumeiCount = 0;

        monthSlips.forEach(slip=>{

            drinkCount += getItemCountByCast(

                slip.drinks,
                cast.id

            );

            nominationCount += getItemCountByCast(

                slip.nominations,
                cast.id

            );

            extensionCount += getItemCountByCast(

                slip.extensions,
                cast.id

            );

            slip.champagnes.forEach(item=>{

                if(item.castId!==cast.id){

                    return;

                }

                if(item.type==="ポンパ"){

                    pompaCount += Number(
                        item.count || 0
                    );

                }

                if(item.type==="マバム"){

                    mavamCount += Number(
                        item.count || 0
                    );

                }

                if(item.type==="ソウメイ"){

                    soumeiCount += Number(
                        item.count || 0
                    );

                }

            });

        });

        const totalHours =
            monthWorkHours

            .filter(
                record=>record.castId===cast.id
            )

            .reduce(

                (total,record)=>
                    total+Number(record.hours || 0),

                0

            );

        const baseSalary =
            totalHours * Number(cast.hourly || 0);

        const drinkBack =
            drinkCount *
            Number(cast.drinkBack || 0);

        const nominationBack =
            nominationCount *
            Number(cast.nominationBack || 0);

        const extensionBack =
            extensionCount *
            Number(cast.extensionBack || 0);

        const pompaBack =
            pompaCount *
            Number(cast.pompaBack || 0);

        const mavamBack =
            mavamCount *
            Number(cast.mavamBack || 0);

        const soumeiBack =
            soumeiCount *
            Number(cast.soumeiBack || 0);

        const totalBack =
            drinkBack
            +nominationBack
            +extensionBack
            +pompaBack
            +mavamBack
            +soumeiBack;

        const totalSalary =
            baseSalary + totalBack;

        html += `

        <div class="listCard">

            <h3>

                ${cast.name}

            </h3>

            <div class="row">

                <span>勤務時間</span>

                <strong>

                    ${totalHours}時間

                </strong>

            </div>

            <div class="row">

                <span>基本給</span>

                <strong>

                    ${money(baseSalary)}

                </strong>

            </div>

            <hr style="margin:12px 0;">

            <div class="row">

                <span>ドリンク</span>

                <strong>

                    ${drinkCount}杯・
                    ${money(drinkBack)}

                </strong>

            </div>

            <div class="row">

                <span>指名</span>

                <strong>

                    ${nominationCount}本・
                    ${money(nominationBack)}

                </strong>

            </div>

            <div class="row">

                <span>延長</span>

                <strong>

                    ${extensionCount}回・
                    ${money(extensionBack)}

                </strong>

            </div>

            <div class="row">

                <span>ポンパ</span>

                <strong>

                    ${pompaCount}本・
                    ${money(pompaBack)}

                </strong>

            </div>

            <div class="row">

                <span>マバム</span>

                <strong>

                    ${mavamCount}本・
                    ${money(mavamBack)}

                </strong>

            </div>

            <div class="row">

                <span>ソウメイ</span>

                <strong>

                    ${soumeiCount}本・
                    ${money(soumeiBack)}

                </strong>

            </div>

            <hr style="margin:12px 0;">

            <div class="row">

                <span>バック合計</span>

                <strong>

                    ${money(totalBack)}

                </strong>

            </div>

            <div class="totalBox">

                <span>給与合計</span>

                <strong>

                    ${money(totalSalary)}

                </strong>

            </div>

        </div>

        `;

    });

    list.innerHTML = html;

}


/* =====================================
   キャスト別件数
===================================== */

function getItemCountByCast(items,castId){

    if(!Array.isArray(items)){

        return 0;

    }

    return items

        .filter(item=>item.castId===castId)

        .reduce(

            (total,item)=>{

                return total
                    +Number(item.count || 0);

            },

            0

        );

}

