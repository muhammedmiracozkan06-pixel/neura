// --- ANAHTARLAR VE AYARLAR ---
const GK = "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";
const HF_KEY = "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"; 
const MY_MODEL_ID = "muhamsdadefwf/Neura_MAX_1_Final";

let isLoading = false;
let isMusicMode = false;
let isImageMode = false;

// --- 1. GİRİŞ VE KİMLİK DOĞRULAMA (TAMİR EDİLDİ) ---
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
        uTag.className = "guest-text";
        if (pfpImg) pfpImg.style.display = "none"; // Misafirde fotoyu gizle
    } else {
        uTag.className = "";
        if (photo && pfpImg) {
            pfpImg.src = photo;
            pfpImg.style.display = "block";
            pfpImg.classList.remove("hidden");
        }
    }
    addMsg("Neura'ya giriş yapıldı. Hoş geldin " + name + "!", "bot");
}

// --- 2. ARAÇLAR VE ETİKET YÖNETİMİ ---
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
    document.getElementById("q").placeholder = "Görselinizi açıklayın...";
    toggleTools();
}

function removeImageTag() {
    const tag = document.getElementById("image-tag");
    if (tag) tag.remove();
    isImageMode = false;
    document.getElementById("q").placeholder = "Bir şeyler yazın...";
}

// --- 3. ANA ZEKA FONKSİYONU (NEURA MAX-1 DESTEKLİ) ---
async function talk() {
    if (isLoading) return;
    const qInput = document.getElementById("q");
    const val = qInput.value.trim();
    const modelChoice = document.getElementById("model-select").value;

    if (!val) return;

    isLoading = true;
    qInput.value = "";
    addMsg(val, "user");

    let status = "Düşünüyor...";
    if (isMusicMode) status = "🎵 Müzik besteleniyor...";
    if (isImageMode) status = "🖼️ Görsel çiziliyor...";
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
            const audioBox = addMsg("İşte müziğin: ", "bot");
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
            if (modelChoice === "neura-max-1") {
                // KENDİ ÖZEL MODELİNE GİDER
                const r = await fetch(`https://api-inference.huggingface.co/models/${MY_MODEL_ID}`, {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${HF_KEY}`, "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        inputs: val, 
                        parameters: { max_new_tokens: 500, return_full_text: false } 
                    })
                });
                const data = await r.json();
                loadDiv.remove();
                
                // Hugging Face yanıt yapısını kontrol et
                let reply = "Cevap üretilemedi.";
                if (Array.isArray(data)) reply = data[0].generated_text;
                else if (data.generated_text) reply = data.generated_text;
                else if (data.error) reply = "Model uyanıyor, lütfen 10 saniye sonra tekrar dene.";

                addMsg(reply, "bot");
            } else {
                // GROQ MODELLERİNE GİDER
                const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GK}` },
                    body: JSON.stringify({
                        model: modelChoice,
                        messages: [
                            { role: "system", content: "Nazik, zeki ve yardımcı bir asistansın." },
                            { role: "user", content: val }
                        ]
                    })
                });
                const data = await r.json();
                loadDiv.remove();
                addMsg(data.choices[0].message.content, "bot");
            }
        }
    } catch (e) {
        if (loadDiv) loadDiv.innerHTML = "❌ Bir bağlantı hatası oluştu.";
    }
    isLoading = false;
}

// --- 4. YARDIMCI FONKSİYONLAR ---
function addMsg(txt, cls) {
    const d = document.createElement("div");
    d.className = `msg ${cls}`;
    d.innerHTML = txt.replace(/\n/g, "<br>");
    const box = document.getElementById("chat");
    if (box) {
        box.appendChild(d);
        box.scrollTop = box.scrollHeight;
    }
    return d;
}

document.getElementById("q").addEventListener("keypress", (e) => {
    if (e.key === "Enter") talk();
});
