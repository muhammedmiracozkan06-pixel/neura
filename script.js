const GK = "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";
const HF_KEY = "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";

let isLoading = false;
let isMusicMode = false;
let isImageMode = false;

// 1. Giriş Yanıtları
window.onSignIn = (resp) => {
    try {
        const payload = JSON.parse(atob(resp.credential.split('.')[1]));
        enterApp(payload.name, payload.picture, "Google");
    } catch (e) {
        enterApp("Kullanıcı", "", "Google");
    }
};

window.enterAsGuest = () => {
    enterApp("guest", "", "Guest");
};

function enterApp(name, photo, provider) {
    const overlay = document.getElementById("auth-overlay");
    const app = document.getElementById("main-app");
    const uTag = document.getElementById("u-tag");
    const pfpImg = document.getElementById("user-pfp");

    if (overlay) overlay.style.display = "none";
    if (app) app.style.display = "flex";

    uTag.textContent = name;
    if (provider === "Guest") {
        uTag.className = "guest-text";
        pfpImg.classList.add("hidden");
    } else {
        uTag.className = "";
        if (photo) {
            pfpImg.src = photo;
            pfpImg.classList.remove("hidden");
        }
    }
    addMsg("Neura MAX sistemine giriş yapıldı. Hoş geldin " + name + "!", "bot");
}

// 2. Araçlar ve Etiket Yönetimi
function toggleTools() {
    document.getElementById("tools-menu").classList.toggle("hidden");
}

function addMusicTag() {
    if (isMusicMode) return;
    if (isImageMode) removeImageTag();
    const tagsArea = document.getElementById("active-tags");
    const tag = document.createElement("div");
    tag.className = "tag";
    tag.id = "music-tag";
    tag.innerHTML = `🎵 Müzik Oluştur <span class="tag-close" onclick="removeMusicTag()">×</span>`;
    tagsArea.appendChild(tag);
    isMusicMode = true;
    document.getElementById("q").placeholder = "Nasıl bir müzik istersin?";
    toggleTools();
}

function removeMusicTag() {
    const tag = document.getElementById("music-tag");
    if (tag) tag.remove();
    isMusicMode = false;
    document.getElementById("q").placeholder = "Bir şeyler yazın...";
}

function addImageTag() {
    if (isImageMode) return;
    if (isMusicMode) removeMusicTag();
    const tagsArea = document.getElementById("active-tags");
    const tag = document.createElement("div");
    tag.className = "tag";
    tag.id = "image-tag";
    tag.innerHTML = `🖼️ Görsel Oluştur <span class="tag-close" onclick="removeImageTag()">×</span>`;
    tagsArea.appendChild(tag);
    isImageMode = true;
    document.getElementById("q").placeholder = "Nasıl bir görsel çizelim patron?";
    toggleTools();
}

function removeImageTag() {
    const tag = document.getElementById("image-tag");
    if (tag) tag.remove();
    isImageMode = false;
    document.getElementById("q").placeholder = "Bir şeyler yazın...";
}

// 3. Ana Fonksiyon (Sohbet + Müzik + Görsel)
async function talk() {
    if (isLoading) return;
    const qInput = document.getElementById("q");
    const val = qInput.value.trim();
    const model = document.getElementById("model-select").value;

    if (!val) return;

    isLoading = true;
    qInput.value = "";
    addMsg(val, "user");

    let status = "Düşünüyor...";
    if (isMusicMode) status = "🎵 Müzik besteleniyor (yaklaşık 30 sn)...";
    if (isImageMode) status = "🖼️ Görsel çiziliyor (yaklaşık 15 sn)...";
    const loadDiv = addMsg(status, "bot");

    try {
        if (isMusicMode) {
            const resp = await fetch("https://api-inference.huggingface.co/models/facebook/musicgen-small", {
                headers: { Authorization: `Bearer ${HF_KEY}` },
                method: "POST",
                body: JSON.stringify({ inputs: val })
            });
            if (!resp.ok) throw new Error();
            const blob = await resp.blob();
            loadDiv.remove();
            const audioBox = addMsg("İşte müziğin patron: ", "bot");
            const audio = document.createElement("audio");
            audio.src = URL.createObjectURL(blob);
            audio.controls = true;
            audio.style.width = "100%";
            audio.style.marginTop = "10px";
            audioBox.appendChild(audio);
            removeMusicTag();
        } 
        else if (isImageMode) {
            const resp = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0", {
                headers: { Authorization: `Bearer ${HF_KEY}` },
                method: "POST",
                body: JSON.stringify({ inputs: val })
            });
            if (!resp.ok) throw new Error();
            const blob = await resp.blob();
            loadDiv.remove();
            const imgBox = addMsg("İşte senin için çizdiğim görsel:", "bot");
            const img = document.createElement("img");
            img.src = URL.createObjectURL(blob);
            img.className = "image-msg";
            img.style.maxWidth = "100%";
            img.style.borderRadius = "10px";
            imgBox.appendChild(img);
            removeImageTag();
        } 
        else {
            const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GK}` },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: "system", content: "Sen Mirac tarafından geliştirilen Neura MAX isimli, nazik ve zeki bir asistansın. Wind Developer ürünlerinden birisin." },
                        { role: "user", content: val }
                    ]
                })
            });
            const data = await r.json();
            loadDiv.remove();
            addMsg(data.choices[0].message.content, "bot");
        }
    } catch (e) {
        loadDiv.innerHTML = "❌ Bir hata oluştu";
    }
    isLoading = false;
}

// 4. Yardımcılar
function addMsg(txt, cls) {
    const d = document.createElement("div");
    d.className = `msg ${cls}`;
    d.innerHTML = txt.replace(/\n/g, "<br>");
    const box = document.getElementById("chat");
    box.appendChild(d);
    box.scrollTop = box.scrollHeight;
    return d;
}

document.getElementById("q").addEventListener("keypress", (e) => {
    if (e.key === "Enter") talk();
});
