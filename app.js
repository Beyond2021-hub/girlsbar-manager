"use strict";

const STORAGE_KEYS = {
  casts: "girlsbar_casts_v2",
  slips: "girlsbar_slips_v2"
};

const PRICES = {
  drink: 1000,
  nomination: 1000,
  extension: 0
};

const DEFAULT_CASTS = [
  {
    id: crypto.randomUUID(),
    name: "あかり",
    hourlyWage: 2000,
    drinkBack: 200,
    nominationBack: 500,
    extensionBack: 500
  },
  {
    id: crypto.randomUUID(),
    name: "さくらこ",
    hourlyWage: 2000,
    drinkBack: 200,
    nominationBack: 500,
    extensionBack: 500
  }
];

const content = document.getElementById("content");

document.getElementById("today").textContent =
  new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

initializeData();
updateDashboard();
showSlipForm();

function initializeData() {
  const casts = getCasts();

  if (casts.length === 0) {
    saveCasts(DEFAULT_CASTS);
  }
}

function getCasts() {
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEYS.casts)
    ) || [];
  } catch (error) {
    console.error("キャストデータの読み込みに失敗しました", error);
    return [];
  }
}

function saveCasts(casts) {
  localStorage.setItem(
    STORAGE_KEYS.casts,
    JSON.stringify(casts)
  );
}

function getSlips() {
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEYS.slips)
    ) || [];
  } catch (error) {
    console.error("伝票データの読み込みに失敗しました", error);
    return [];
  }
}

function saveSlips(slips) {
  localStorage.setItem(
    STORAGE_KEYS.slips,
    JSON.stringify(slips)
  );
}

function getTodayBusinessDate() {
  return new Date().toISOString().slice(0, 10);
}

function formatMoney(value) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0
  }).format(Number(value) || 0);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getCastById(castId) {
  return getCasts().find((cast) => cast.id === castId);
}

function createCastOptions(selectedId = "") {
  const casts = getCasts();

  return `
    <option value="">キャストを選択</option>
    ${casts.map((cast) => `
      <option
        value="${cast.id}"
        ${cast.id === selectedId ? "selected" : ""}
      >
        ${escapeHtml(cast.name)}
      </option>
    `).join("")}
  `;
}

function showSlipForm() {
  const casts = getCasts();

  if (casts.length === 0) {
    content.innerHTML = `
      <section class="panel">
        <p class="empty-message">
          先にキャストを登録してください。
        </p>

        <button onclick="showCastSettings()">
          キャスト設定を開く
        </button>
      </section>
    `;
    return;
  }

  content.innerHTML = `
    <form id="slipForm" class="form-panel">
      <h2>伝票入力</h2>

      <label>
        営業日
        <input
          id="businessDate"
          type="date"
          value="${getTodayBusinessDate()}"
          required
        >
      </label>

      <label>
        セット料金
        <input
          id="setFee"
          type="number"
          value="4000"
          min="0"
          step="100"
        >
      </label>

      <h3>ドリンク</h3>

      <div id="drinkRows" class="item-list"></div>

      <button
        type="button"
        class="add-button"
        onclick="addItemRow('drink')"
      >
        ＋ ドリンクを追加
      </button>

      <h3>指名</h3>

      <div id="nominationRows" class="item-list"></div>

      <button
        type="button"
        class="add-button"
        onclick="addItemRow('nomination')"
      >
        ＋ 指名を追加
      </button>

      <h3>延長</h3>

      <div id="extensionRows" class="item-list"></div>

      <button
        type="button"
        class="add-button"
        onclick="addItemRow('extension')"
      >
        ＋ 延長を追加
      </button>

      <div class="slip-total-box">
        <span>伝票合計</span>
        <strong id="slipTotal">¥4,000</strong>
      </div>

      <div class="action-grid">
        <button type="submit">
          伝票を保存
        </button>

        <button
          type="button"
          class="light"
          onclick="showSlipForm()"
        >
          入力をリセット
        </button>
      </div>
    </form>
  `;

  document
    .getElementById("setFee")
    .addEventListener("input", calculateSlipTotal);

  document
    .getElementById("slipForm")
    .addEventListener("submit", saveSlip);

  addItemRow("drink");
  calculateSlipTotal();
}

function addItemRow(type) {
  const settings = getItemSettings(type);
  const container = document.getElementById(settings.containerId);

  if (!container) {
    return;
  }

  const row = document.createElement("div");
  row.className = "item-row";
  row.dataset.type = type;

  row.innerHTML = `
    <div class="item-row-top">
      <select class="item-cast" required>
        ${createCastOptions()}
      </select>

      <button
        type="button"
        class="danger"
        onclick="removeItemRow(this)"
      >
        削除
      </button>
    </div>

    <div class="item-row-bottom">
      <button
        type="button"
        class="light"
        onclick="changeItemCount(this, -1)"
      >
        −
      </button>

      <input
        class="item-count"
        type="number"
        value="1"
        min="1"
        step="1"
      >

      <button
        type="button"
        class="light"
        onclick="changeItemCount(this, 1)"
      >
        ＋
      </button>
    </div>

    <span class="item-subtotal">
      ${settings.unitLabel}：
      <span class="item-sales">
        ${formatMoney(settings.salePrice)}
      </span>
    </span>
  `;

  container.appendChild(row);

  row
    .querySelector(".item-count")
    .addEventListener("input", calculateSlipTotal);

  calculateSlipTotal();
}

function getItemSettings(type) {
  const settings = {
    drink: {
      containerId: "drinkRows",
      salePrice: PRICES.drink,
      unitLabel: "ドリンク売上"
    },
    nomination: {
      containerId: "nominationRows",
      salePrice: PRICES.nomination,
      unitLabel: "指名売上"
    },
    extension: {
      containerId: "extensionRows",
      salePrice: PRICES.extension,
      unitLabel: "延長売上"
    }
  };

  return settings[type];
}

function removeItemRow(button) {
  button.closest(".item-row").remove();
  calculateSlipTotal();
}

function changeItemCount(button, amount) {
  const row = button.closest(".item-row");
  const input = row.querySelector(".item-count");

  const currentCount = Number(input.value) || 1;
  input.value = Math.max(1, currentCount + amount);

  calculateSlipTotal();
}

function calculateSlipTotal() {
  const setFee =
    Number(document.getElementById("setFee")?.value) || 0;

  let itemSalesTotal = 0;

  document.querySelectorAll(".item-row").forEach((row) => {
    const type = row.dataset.type;
    const settings = getItemSettings(type);

    const count =
      Math.max(
        0,
        Number(row.querySelector(".item-count").value) || 0
      );

    const subtotal = count * settings.salePrice;
    itemSalesTotal += subtotal;

    row.querySelector(".item-sales").textContent =
      formatMoney(subtotal);
  });

  const total = setFee + itemSalesTotal;

  const totalElement = document.getElementById("slipTotal");

  if (totalElement) {
    totalElement.textContent = formatMoney(total);
  }

  return total;
}

function collectRows(type) {
  const settings = getItemSettings(type);
  const container = document.getElementById(settings.containerId);

  if (!container) {
    return [];
  }

  return [...container.querySelectorAll(".item-row")]
    .map((row) => {
      const castId =
        row.querySelector(".item-cast").value;

      const count =
        Number(row.querySelector(".item-count").value) || 0;

      return {
        castId,
        count,
        unitSalePrice: settings.salePrice,
        sales: count * settings.salePrice
      };
    })
    .filter((item) => item.castId && item.count > 0);
}

function calculateBackTotal(slips) {
  return slips.reduce((slipsTotal, slip) => {
    const drinkBack = slip.drinks.reduce((total, item) => {
      const cast = getCastById(item.castId);

      return total +
        item.count * (Number(cast?.drinkBack) || 0);
    }, 0);

    const nominationBack =
      slip.nominations.reduce((total, item) => {
        const cast = getCastById(item.castId);

        return total +
          item.count *
          (Number(cast?.nominationBack) || 0);
      }, 0);

    const extensionBack =
      slip.extensions.reduce((total, item) => {
        const cast = getCastById(item.castId);

        return total +
          item.count *
          (Number(cast?.extensionBack) || 0);
      }, 0);

    return slipsTotal +
      drinkBack +
      nominationBack +
      extensionBack;
  }, 0);
}

function saveSlip(event) {
  event.preventDefault();

  const drinks = collectRows("drink");
  const nominations = collectRows("nomination");
  const extensions = collectRows("extension");

  const allRows = [
    ...drinks,
    ...nominations,
    ...extensions
  ];

  if (allRows.some((item) => !item.castId)) {
    alert("キャストを選択してください");
    return;
  }

  const setFee =
    Number(document.getElementById("setFee").value) || 0;

  const itemSales = allRows.reduce(
    (total, item) => total + item.sales,
    0
  );

  const slip = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    businessDate:
      document.getElementById("businessDate").value,
    setFee,
    drinks,
    nominations,
    extensions,
    totalSales: setFee + itemSales
  };

  const slips = getSlips();
  slips.push(slip);
  saveSlips(slips);

  updateDashboard();

  alert(
    `伝票を保存しました\n合計：${formatMoney(slip.totalSales)}`
  );

  showSlipForm();
}

function showCastSettings() {
  const casts = getCasts();

  content.innerHTML = `
    <section class="panel">
      <h2>キャスト設定</h2>

      <div class="notice">
        バック金額を変更すると、過去の集計も現在の設定で再計算されます。
      </div>

      <form id="castForm" class="form-panel">
        <label>
          キャスト名
          <input
            id="castName"
            type="text"
            placeholder="例：あかり"
            required
          >
        </label>

        <label>
          時給
          <input
            id="hourlyWage"
            type="number"
            value="2000"
            min="0"
          >
        </label>

        <label>
          ドリンクバック／1杯
          <input
            id="drinkBack"
            type="number"
            value="200"
            min="0"
          >
        </label>

        <label>
          指名バック／1件
          <input
            id="nominationBack"
            type="number"
            value="500"
            min="0"
          >
        </label>

        <label>
          延長バック／1件
          <input
            id="extensionBack"
            type="number"
            value="500"
            min="0"
          >
        </label>

        <button type="submit">
          キャストを登録
        </button>
      </form>

      <div id="castList"></div>
    </section>
  `;

  document
    .getElementById("castForm")
    .addEventListener("submit", addCast);

  renderCastList(casts);
}

function addCast(event) {
  event.preventDefault();

  const name =
    document.getElementById("castName").value.trim();

  if (!name) {
    alert("キャスト名を入力してください");
    return;
  }

  const casts = getCasts();

  if (
    casts.some(
      (cast) =>
        cast.name.toLowerCase() === name.toLowerCase()
    )
  ) {
    alert("同じ名前のキャストが登録されています");
    return;
  }

  casts.push({
    id: crypto.randomUUID(),
    name,
    hourlyWage:
      Number(document.getElementById("hourlyWage").value) || 0,
    drinkBack:
      Number(document.getElementById("drinkBack").value) || 0,
    nominationBack:
      Number(
        document.getElementById("nominationBack").value
      ) || 0,
    extensionBack:
      Number(
        document.getElementById("extensionBack").value
      ) || 0
  });

  saveCasts(casts);
  showCastSettings();
}

function renderCastList(casts) {
  const castList = document.getElementById("castList");

  if (!castList) {
    return;
  }

  if (casts.length === 0) {
    castList.innerHTML = `
      <p class="empty-message">
        キャストが登録されていません。
      </p>
    `;
    return;
  }

  castList.innerHTML = `
    <h2>登録済みキャスト</h2>

    ${casts.map((cast) => `
      <article class="cast-card">
        <h3>${escapeHtml(cast.name)}</h3>

        <div class="detail-list">
          <div class="detail-line">
            <span>時給</span>
            <strong>${formatMoney(cast.hourlyWage)}</strong>
          </div>

          <div class="detail-line">
            <span>ドリンクバック</span>
            <strong>${formatMoney(cast.drinkBack)}／杯</strong>
          </div>

          <div class="detail-line">
            <span>指名バック</span>
            <strong>${formatMoney(cast.nominationBack)}／件</strong>
          </div>

          <div class="detail-line">
            <span>延長バック</span>
            <strong>${formatMoney(cast.extensionBack)}／件</strong>
          </div>
        </div>

        <button
          type="button"
          class="danger"
          onclick="deleteCast('${cast.id}')"
        >
          削除
        </button>
      </article>
    `).join("")}
  `;
}

function deleteCast(castId) {
  const cast = getCastById(castId);

  if (!cast) {
    return;
  }

  const confirmed = confirm(
    `${cast.name}を削除しますか？`
  );

  if (!confirmed) {
    return;
  }

  const newCasts =
    getCasts().filter((item) => item.id !== castId);

  saveCasts(newCasts);
  showCastSettings();
  updateDashboard();
}

function showSlipList() {
  const slips = [...getSlips()].reverse();

  content.innerHTML = `
    <section class="panel">
      <h2>伝票一覧</h2>

      ${
        slips.length === 0
          ? `
            <p class="empty-message">
              伝票がまだありません。
            </p>
          `
          : slips.map(renderSlipCard).join("")
      }
    </section>
  `;
}

function renderSlipCard(slip) {
  const drinkLines = renderSlipItems(
    slip.drinks,
    "ドリンク"
  );

  const nominationLines = renderSlipItems(
    slip.nominations,
    "指名"
  );

  const extensionLines = renderSlipItems(
    slip.extensions,
    "延長"
  );

  return `
    <article class="slip-card">
      <h3>
  ${escapeHtml(slip.businessDate)}
  </h3>

      <div class="detail-list">
        <div class="detail-line">
          <span>セット料金</span>
          <strong>${formatMoney(slip.setFee)}</strong>
        </div>

        ${drinkLines}
        ${nominationLines}
        ${extensionLines}

        <div class="detail-line">
          <span>合計</span>
          <strong>${formatMoney(slip.totalSales)}</strong>
        </div>
      </div>

      <button
        type="button"
        class="danger"
        onclick="deleteSlip('${slip.id}')"
      >
        この伝票を削除
      </button>
    </article>
  `;
}

function renderSlipItems(items = [], label) {
  return items.map((item) => {
    const cast = getCastById(item.castId);

    return `
      <div class="detail-line">
        <span>
          ${label}
          （${escapeHtml(cast?.name || "削除済み")}）
          × ${item.count}
        </span>

        <strong>${formatMoney(item.sales)}</strong>
      </div>
    `;
  }).join("");
}

function deleteSlip(slipId) {
  const confirmed = confirm(
    "この伝票を削除しますか？"
  );

  if (!confirmed) {
    return;
  }

  const newSlips =
    getSlips().filter((slip) => slip.id !== slipId);

  saveSlips(newSlips);
  updateDashboard();
  showSlipList();
}

function showCastSummary() {
  const slips = getSlips();
  const casts = getCasts();

  const summaries = casts.map((cast) => {
    let drinkCount = 0;
    let nominationCount = 0;
    let extensionCount = 0;

    slips.forEach((slip) => {
      drinkCount += sumCastCount(
        slip.drinks,
        cast.id
      );

      nominationCount += sumCastCount(
        slip.nominations,
        cast.id
      );

      extensionCount += sumCastCount(
        slip.extensions,
        cast.id
      );
    });

    const drinkBack =
      drinkCount * cast.drinkBack;

    const nominationBack =
      nominationCount * cast.nominationBack;

    const extensionBack =
      extensionCount * cast.extensionBack;

    return {
      cast,
      drinkCount,
      nominationCount,
      extensionCount,
      drinkBack,
      nominationBack,
      extensionBack,
      totalBack:
        drinkBack +
        nominationBack +
        extensionBack
    };
  });

  content.innerHTML = `
    <section class="panel">
      <h2>キャスト別集計</h2>

      ${
        summaries.length === 0
          ? `
            <p class="empty-message">
              キャストが登録されていません。
            </p>
          `
          : summaries.map((summary) => `
            <article class="summary-person-card">
              <h3>${escapeHtml(summary.cast.name)}</h3>

              <div class="detail-list">
                <div class="detail-line">
                  <span>ドリンク</span>
                  <strong>
                    ${summary.drinkCount}杯・
                    ${formatMoney(summary.drinkBack)}
                  </strong>
                </div>

                <div class="detail-line">
                  <span>指名</span>
                  <strong>
                    ${summary.nominationCount}件・
                    ${formatMoney(summary.nominationBack)}
                  </strong>
                </div>

                <div class="detail-line">
                  <span>延長</span>
                  <strong>
                    ${summary.extensionCount}件・
                    ${formatMoney(summary.extensionBack)}
                  </strong>
                </div>

                <div class="detail-line">
                  <span>バック合計</span>
                  <strong>
                    ${formatMoney(summary.totalBack)}
                  </strong>
                </div>
              </div>
            </article>
          `).join("")
      }
    </section>
  `;
}

function sumCastCount(items = [], castId) {
  return items
    .filter((item) => item.castId === castId)
    .reduce(
      (total, item) => total + Number(item.count),
      0
    );
}

function updateDashboard() {
  const today = getTodayBusinessDate();

  const todaySlips =
    getSlips().filter(
      (slip) => slip.businessDate === today
    );

  const totalSales = todaySlips.reduce(
    (total, slip) =>
      total + Number(slip.totalSales || 0),
    0
  );

  const totalBack = calculateBackTotal(todaySlips);
  const estimatedProfit = totalSales - totalBack;

  document.getElementById("todaySales").textContent =
    formatMoney(totalSales);

  document.getElementById("todayBack").textContent =
    formatMoney(totalBack);

  document.getElementById("todaySlipCount").textContent =
    `${todaySlips.length}件`;

  document.getElementById("todayProfit").textContent =
    formatMoney(estimatedProfit);
}