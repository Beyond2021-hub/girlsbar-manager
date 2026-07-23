const content = document.getElementById("content");

document.getElementById("today").textContent =
  new Date().toLocaleDateString("ja-JP");

function showSlipForm() {
  content.innerHTML = `
    <form id="slipForm">
      <h2>伝票入力</h2>

      <label>
        キャスト
        <select id="castName" required>
          <option value="">選択してください</option>
          <option value="さき">さき</option>
          <option value="あい">あい</option>
        </select>
      </label>

      <label>
        セット料金
        <input id="setFee" type="number" value="0" min="0">
      </label>

      <label>
        ドリンク杯数
        <input id="drinkCount" type="number" value="0" min="0">
      </label>

      <label>
        ボトル金額
        <input id="bottleSales" type="number" value="0" min="0">
      </label>

      <label>
        本指名数
        <input id="mainNomination" type="number" value="0" min="0">
      </label>

      <label>
        値引き
        <input id="discount" type="number" value="0" min="0">
      </label>

      <label>
        支払方法
        <select id="paymentMethod">
          <option value="cash">現金</option>
          <option value="card">カード</option>
          <option value="receivable">売掛</option>
        </select>
      </label>

      <button type="submit">保存する</button>
    </form>
  `;

  document
    .getElementById("slipForm")
    .addEventListener("submit", saveSlip);
}

function showAttendanceForm() {
  content.innerHTML = `
    <form>
      <h2>勤怠入力</h2>

      <label>
        キャスト
        <select>
          <option>さき</option>
          <option>あい</option>
        </select>
      </label>

      <label>
        出勤時間
        <input type="time">
      </label>

      <label>
        退勤時間
        <input type="time">
      </label>

      <label>
        休憩時間（分）
        <input type="number" value="0" min="0">
      </label>

      <button type="button">保存する</button>
    </form>
  `;
}

function showCastForm() {
  content.innerHTML = `
    <form>
      <h2>キャスト設定</h2>

      <label>
        名前
        <input type="text">
      </label>

      <label>
        時給
        <input type="number" value="2000">
      </label>

      <label>
        ドリンクバック
        <input type="number" value="200">
      </label>

      <label>
        本指名バック
        <input type="number" value="1000">
      </label>

      <label>
        ボトルバック率
        <input type="number" value="10">
      </label>

      <button type="button">登録する</button>
    </form>
  `;
}

function showDailySummary() {
  content.innerHTML = `
    <div class="card" style="margin-top: 20px;">
      <h2>本日の集計</h2>
      <p>総売上：<strong id="dailySales">¥0</strong></p>
      <p>人件費：<strong id="dailySalary">¥0</strong></p>
      <p>経費：<strong id="dailyExpenses">¥0</strong></p>
      <p>利益：<strong id="dailyProfit">¥0</strong></p>
    </div>
  `;

  updateSummary();
}

function saveSlip(event) {
  event.preventDefault();

  const slip = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    castName: document.getElementById("castName").value,
    setFee: Number(document.getElementById("setFee").value),
    drinkCount: Number(
      document.getElementById("drinkCount").value
    ),
    bottleSales: Number(
      document.getElementById("bottleSales").value
    ),
    mainNomination: Number(
      document.getElementById("mainNomination").value
    ),
    discount: Number(
      document.getElementById("discount").value
    ),
    paymentMethod:
      document.getElementById("paymentMethod").value
  };

  const slips =
    JSON.parse(localStorage.getItem("slips")) || [];

  slips.push(slip);

  localStorage.setItem(
    "slips",
    JSON.stringify(slips)
  );

  updateSummary();

  alert("伝票を保存しました");
  event.target.reset();
}

function updateSummary() {
  const slips =
    JSON.parse(localStorage.getItem("slips")) || [];

  const totalSales = slips.reduce((sum, slip) => {
    return (
      sum +
      slip.setFee +
      slip.bottleSales -
      slip.discount
    );
  }, 0);

  const salary = slips.reduce((sum, slip) => {
    const drinkBack = slip.drinkCount * 200;
    const nominationBack =
      slip.mainNomination * 1000;
    const bottleBack =
      slip.bottleSales * 0.1;

    return (
      sum +
      drinkBack +
      nominationBack +
      bottleBack
    );
  }, 0);

  const expenses = 0;
  const profit =
    totalSales - salary - expenses;

  document.getElementById("sales").textContent =
    formatMoney(totalSales);

  document.getElementById("salary").textContent =
    formatMoney(salary);

  document.getElementById("expenses").textContent =
    formatMoney(expenses);

  document.getElementById("profit").textContent =
    formatMoney(profit);

  const dailySales =
    document.getElementById("dailySales");

  if (dailySales) {
    dailySales.textContent =
      formatMoney(totalSales);

    document.getElementById(
      "dailySalary"
    ).textContent = formatMoney(salary);

    document.getElementById(
      "dailyExpenses"
    ).textContent = formatMoney(expenses);

    document.getElementById(
      "dailyProfit"
    ).textContent = formatMoney(profit);
  }
}

function formatMoney(value) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0
  }).format(value);
}

updateSummary();