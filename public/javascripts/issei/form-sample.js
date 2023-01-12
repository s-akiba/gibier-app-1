document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contant-form");
    new Form(contactForm);
});

function Form(form) {
    this.form = form;
    this.inputElement = this.form.querySelectorAll("input,select,textarea");
    this.textareaComponent = this.form.querySelectorAll(".js-flexible-textarea");
    this.inputFileComponent = this.form.querySelectorAll(".js-flie-select");
    this.zipButton = this.form.querySelector(".js-address-search");
    this.inputDate = this.form.querySelectorAll('[type="date"]');
    this.submit = this.form.querySelector('[type="submit"]');
    this.init();
    this.handleEvent();
}

/**
 * 初期化
 */
Form.prototype.init = function () {
    this.validateSubmit();
    this.inputDate.forEach(this.initInputDate);
    this.textareaComponent.forEach(this.flexTextarea);
    this.inputFileComponent.forEach(this.displaySelectedFilename);
};

/**
 * イベントを登録する。
 */
Form.prototype.handleEvent = function () {
    this.handleValidation(this.inputElement);
    this.handleZipSearch(this.zipButton);
    this.handleSubmit(this.submit);
};

/**
 * バリデーションに関するイベントを登録する。
 */
Form.prototype.handleValidation = function (input) {
    input.forEach((currentInput) => {
        // 入力内容が変更されたらメッセージを表示
        currentInput.addEventListener("change", this.displayValidation.bind(this));

        // 送信ボタンのバリデーション操作
        currentInput.addEventListener("change", this.validateSubmit.bind(this));
    });
};

/**
 * 住所検索に関するイベントを登録する。
 */
Form.prototype.handleZipSearch = function (searchButton) {
    searchButton.addEventListener("click", this.searchAddress.bind(this));
};

/**
 * 送信ボタンに関するイベントを登録する。
 */
Form.prototype.handleSubmit = function (submit) {
    submit.addEventListener("click", this.pressSubmit.bind(this));
};

/**
 * バリデーションメッセージを表示します。
 */
Form.prototype.displayValidation = function (event) {
    const targetInput = event.target;
    const targetName = targetInput.getAttribute("name");
    const invalidMessage = targetInput.getAttribute("title");
    const messageArea = this.form.querySelector(
        `[data-validation="${targetName}"]`
    );
    const hasValidateMessage = messageArea && targetInput.hasAttribute("title");
    const isValid = targetInput.validity.valid;

    targetInput.setAttribute("data-is-valid", isValid);

    if (hasValidateMessage) {
        messageArea.textContent = isValid ? "" : invalidMessage;
    }
};

/**
 * フォームの内容に応じて送信ボタンの状態を変えます。
 */
Form.prototype.validateSubmit = function () {
    const isValid = this.form.checkValidity();
    const submitButton = this.submit;
    const messageArea = this.form.querySelector('[data-validation="submit"]');

    submitButton.setAttribute("aria-disabled", !isValid);
    messageArea.innerHTML = isValid ? "" : "必須項目がすべて入力されていません";
};

/**
 * input[type="date"]の初期値に翌日の日付を指定する
 * 指定可能日付を翌日から二週間後までにする。
 * @use https://momentjs.com/
 */
Form.prototype.initInputDate = function (input) {
    const min = moment().add(1, "days").format("YYYY-MM-DD");
    const max = moment().add(14, "days").format("YYYY-MM-DD");

    input.value = min;
    input.setAttribute("min", min);
    input.setAttribute("max", max);
};

/**
 * textareaを内容に応じて伸縮させます。
 * @see https://qiita.com/tsmd/items/fce7bf1f65f03239eef0
 */
Form.prototype.flexTextarea = function (component) {
    const textarea = component.querySelector("textarea");
    const dummyBox = document.createElement("div");
    dummyBox.className = "_dummy-box";
    dummyBox.setAttribute("aria-hidden", true);
    component.insertBefore(dummyBox, null);

    textarea.addEventListener("input", (event) => {
        dummyBox.textContent = event.target.value + "\u200b";
    });
};

/**
 * input[type=file]で選択されたファイル名を表示します。
 */
Form.prototype.displaySelectedFilename = function (component) {
    const input = component.querySelector('input[type="file"]');
    const nameBox = document.createElement("p");
    nameBox.className = "_selected-file";
    component.insertBefore(nameBox, null);

    input.addEventListener("input", (event) => {
        nameBox.textContent = event.target.files[0].name;
    });
};

/**
 * 郵便番号の入力で住所をオートコンプリートする時は明示的にボタンを押させて発動します。
 * @see https://waic.jp/docs/WCAG21/Understanding/on-input.html
 * @use https://github.com/ajaxzip3/ajaxzip3.github.io
 */
Form.prototype.searchAddress = function (event) {
    const zip = "postal-code";
    const address1 = "address-level1";
    const address2 = "address-level2";

    const zipInput = this.form.querySelector(`[name="${zip}"]`);
    const address1Input = this.form.querySelector(`[name="${address1}"]`);
    const address2Input = this.form.querySelector(`[name="${address2}"]`);

    AjaxZip3.zip2addr(zip, "", address1, address2);

    // 郵便番号検索成功時に実行する処理
    AjaxZip3.onSuccess = () => {
        address1Input.setAttribute("data-is-valid", "true");
        address2Input.setAttribute("data-is-valid", "true");
        address2Input.focus();
    };

    // 郵便番号検索失敗時に実行する処理
    AjaxZip3.onFailure = () => {
        const messageArea = this.form.querySelector(`[data-validation="${zip}"]`);
        zipInput.setAttribute("data-is-valid", "false");
        messageArea.textContent = "郵便番号に該当する住所が見つかりません";
    };
};

/**
 * 送信ボタン押下時の挙動
 * 今回はテストなので成功時はconsole.logを出して遷移は止める
 */
Form.prototype.pressSubmit = function (event) {
    const isValid = this.form.checkValidity();

    if (isValid) {
        console.log("送信に成功しました！");
    }

    event.preventDefault();
};

/**
 * レスポンシブの360px未満対応を終わらせる。
 */
!(function () {
    const viewport = document.querySelector('meta[name="viewport"]');
    function switchViewport() {
        const value =
            window.outerWidth > 360
                ? "width=device-width,initial-scale=1"
                : "width=360";
        if (viewport.getAttribute("content") !== value) {
            viewport.setAttribute("content", value);
        }
    }
    addEventListener("resize", switchViewport, false);
    switchViewport();
})();
