// --- ANAHTARLAR ---
const GK = "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";
const HF_KEY = "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"; 

let isLoading = false;
let isMusicMode = false;
let isImageMode = false;

// --- 1. GİRİŞ SİSTEMİ ---
window.onSignIn = (resp) => {
    try {
        const payload = JSON.parse(atob(resp.credential.split('.')[1]));
        enterApp(payload.name, payload.picture, "Google");
    } catch (e) {
        enterApp("Kullanıcı", "", "Google");
    }
};

window.enterAsGuest = () => {
    enterApp("Misafir", "", "Guest");
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
        if (pfpImg) pfpImg.style.display = "none";
    } else if (photo && pfpImg) {
        pfpImg.src = photo;
        pfpImg.style.display = "block";
    }
    addMsg("Neura'ya hoş geldin " + name + "!", "bot");
}

// --- 2. MODLAR VE ARAÇLAR ---
function toggleTools() {
    document.getElementById("tools-menu").classList.toggle("hidden");
}

function addMusicTag() {
    if (isMusicMode) return;
    if (isImageMode) removeImageTag();
    const tag = document.createElement("div");
    tag.className = "tag";
    tag.id = "music-tag";
    tag.innerHTML = `🎵 Müzik <span onclick="removeMusicTag()">×</span>`;
    document.getElementById("active-tags").appendChild(tag);
    isMusicMode = true;
    document.getElementById("q").placeholder = "Nasıl bir müzik?";
    toggleTools();
}

function removeMusicTag() {
    document.getElementById("music-tag")?.remove();
    isMusicMode = false;
    document.getElementById("q").placeholder = "Bir şeyler yazın...";
}

function addImageTag() {
    if (isImageMode) return;
    if (isMusicMode) removeMusicTag();
    const tag = document.createElement("div");
    tag.className = "tag";
    tag.id = "image-tag";
    tag.innerHTML = `🖼️ Görsel <span onclick="removeImageTag()">×</span>`;
    document.getElementById("active-tags").appendChild(tag);
    isImageMode = true;
    document.getElementById("q").placeholder = "Görseli tarif et...";
    toggleTools();
}

function removeImageTag() {
    document.getElementById("image-tag")?.remove();
    isImageMode = false;
    document.getElementById("q").placeholder = "Bir şeyler yazın...";
}

// --- 3. ANA KONUŞMA (SAĞLAM SÜRÜM) ---
async function talk() {
    if (isLoading) return;
    const qInput = document.getElementById("q");
    const val = qInput.value.trim();
    const modelChoice = document.getElementById("model-select").value;

    if (!val) return;
    isLoading = true;
    qInput.value = "";
    addMsg(val, "user");

    let status = isMusicMode ? "🎵 Besteleniyor..." : isImageMode ? "🖼️ Çiziliyor..." : "Düşünüyor...";
    const loadDiv = addMsg(status, "bot");

    try {
        if (isMusicMode) {
            const r = await fetch("https://api-inference.huggingface.co/models/facebook/musicgen-small", {
                headers: { Authorization: `Bearer ${HF_KEY}` },
                method: "POST",
                body: JSON.stringify({ inputs: val })
            });
            const blob = await r.blob();
            loadDiv.remove();
            const audio = document.createElement("audio");
            audio.src = URL.createObjectURL(blob);
            audio.controls = true;
            addMsg("İşte müziğin:", "bot").appendChild(audio);
            removeMusicTag();
        } 
        else if (isImageMode) {
            const r = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0", {
                headers: { Authorization: `Bearer ${HF_KEY}` },
                method: "POST",
                body: JSON.stringify({ inputs: val })
            });
            const blob = await r.blob();
            loadDiv.remove();
            const img = document.createElement("img");
            img.src = URL.createObjectURL(blob);
            img.style.width = "100%";
            img.style.borderRadius = "10px";
            addMsg("İşte görselin:", "bot").appendChild(img);
            removeImageTag();
        } 
        else {
            // GROQ MODELLERİ (Llama, Gemma vb.)
            const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GK}` },
                body: JSON.stringify({
                    model: modelChoice,
                    messages: [
                        { role: "system", content: "Sen Neura'sın. Mirac tarafından geliştirildin. Zeki ve nazik bir asistansın." },
                        { role: "user", content: val }
                    ]
                })
            });
            const data = await r.json();
            loadDiv.remove();
            addMsg(data.choices[0].message.content, "bot");
        }
    } catch (e) {
        loadDiv.innerHTML = "❌ Bir sorun oluştu. Lütfen tekrar deneyin.";
    }
    isLoading = false;
}

// --- 4. YARDIMCI ---
function addMsg(txt, cls) {
    const d = document.createElement("div");
    d.className = `msg ${cls}`;
    d.innerHTML = txt.replace(/\n/g, "<br>");
    const box = document.getElementById("chat");
    box.appendChild(d);
    box.scrollTop = box.scrollHeight;
    return d;
}

document.getElementById("q").addEventListener("keypress", (e) => { if (e.key === "Enter") talk(); });
