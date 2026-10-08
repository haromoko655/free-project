document.addEventListener("DOMContentLoaded", function () {

    const tocBox = document.querySelector(".toc-box");
    const floatingToc = document.getElementById("floatingToc");
    const floatingTocUl = floatingToc ? floatingToc.querySelector("ul") : null;

    // h1タグから目次を自動生成
    const headings = document.querySelectorAll("h1[id]");
    if (headings.length === 0) return;

    const tocItems = Array.from(headings).map(function (h) {
        return '<li><a href="#' + h.id + '">' + h.textContent + '</a></li>';
    }).join("");

    // .toc-box に目次を入れる
    if (tocBox) {
        tocBox.innerHTML = '<p class="toc-title">目次</p><ul>' + tocItems + '</ul>';
    }

    // .floating-toc の ul にも同じ内容を挿入
    if (floatingTocUl) {
        floatingTocUl.innerHTML = tocItems;
    }

    // 固定目次を表示
    if (floatingToc) {
        floatingToc.classList.add("show");
    }

    // スマホメニュー関連
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    const closeMenuBtn = document.getElementById("closeMenuBtn");
    const menuOverlay = document.getElementById("menuOverlay");
    const mobileMenuUl = mobileMenu ? mobileMenu.querySelector("ul") : null;

    // スマホメニューに目次を挿入
    if (mobileMenuUl) {
        mobileMenuUl.innerHTML = tocItems;
    }

    function openMenu() {
        if (mobileMenu) mobileMenu.classList.add("open");
        if (menuOverlay) menuOverlay.classList.add("show");
        document.body.style.overflow = "hidden";
    }

    function closeMenu() {
        if (mobileMenu) mobileMenu.classList.remove("open");
        if (menuOverlay) menuOverlay.classList.remove("show");
        document.body.style.overflow = "";
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener("click", openMenu);
    }

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener("click", closeMenu);
    }

    if (menuOverlay) {
        menuOverlay.addEventListener("click", closeMenu);
    }

    // スマホメニュー内のリンクをクリックしたらメニューを閉じる
    if (mobileMenuUl) {
        mobileMenuUl.addEventListener("click", function (e) {
            if (e.target.tagName === "A") {
                closeMenu();
            }
        });
    }

    // ==========================================
    // お知らせ機能
    // ==========================================

    const noticeBell = document.getElementById("noticeBell");
    const noticeDropdown = document.getElementById("noticeDropdown");
    const noticeCloseBtn = document.getElementById("noticeCloseBtn");
    const noticeOverlay = document.getElementById("noticeOverlay");
    const noticeList = document.getElementById("noticeList");
    const noticeDot = document.getElementById("noticeDot");
    const mobileNoticeList = document.getElementById("mobileNoticeList");

    // notice.json を読み込む
    fetch("notice.json")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(function (data) {
            if (!data.notices || data.notices.length === 0) return;

            // お知らせHTMLを生成
            const noticeItems = data.notices.map(function (n) {
                return '<li><span class="notice-date">' + escapeHtml(n.date) + '</span><span class="notice-text">' + escapeHtml(n.text).replace(/\n/g, '<br>') + '</span></li>';
            }).join("");

            // PCドロップダウンに表示
            if (noticeList) {
                noticeList.innerHTML = noticeItems;
            }

            // スマホメニューにも表示
            if (mobileNoticeList) {
                mobileNoticeList.innerHTML = noticeItems;
            }

            // 未読インジケーター（localStorageで既読管理）
            const lastRead = localStorage.getItem("noticeLastRead");
            const latestDate = data.notices[0].date;

            if (lastRead !== latestDate && noticeDot) {
                noticeDot.style.display = "block";
            }
        })
        .catch(function (error) {
            console.log("お知らせの読み込みに失敗しました:", error);
        });

    function escapeHtml(text) {
        var div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    function openNotice() {
        if (noticeDropdown) noticeDropdown.classList.add("open");
        if (noticeOverlay) noticeOverlay.classList.add("show");
        // 読にする
        if (noticeDot) noticeDot.style.display = "none";
        fetch("notice.json")
            .then(function (r) { return r.json(); })
            .then(function (d) {
                if (d.notices && d.notices.length > 0) {
                    localStorage.setItem("noticeLastRead", d.notices[0].date);
                }
            })
            .catch(function () {});
    }

    function closeNotice() {
        if (noticeDropdown) noticeDropdown.classList.remove("open");
        if (noticeOverlay) noticeOverlay.classList.remove("show");
    }

    if (noticeBell) {
        noticeBell.addEventListener("click", openNotice);
    }

    if (noticeCloseBtn) {
        noticeCloseBtn.addEventListener("click", closeNotice);
    }

    if (noticeOverlay) {
        noticeOverlay.addEventListener("click", closeNotice);
    }

});
