const GK = "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";
const HF_KEY = "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";

let isLoading = false;
let isMusicMode = false;
let isImageMode = false; // Görsel modu takibi

// Giriş ve Menü Fonksiyonları (Aynı kalıyor)
window.onSignIn = (resp) => { /* ... senin kodun ... */ };
window.enterAsGuest = () => { /* ... senin kodun ... */ };
function enterApp(name, photo, provider) { /* ... senin kodun ... */ }
function toggleTools() { document.getElementById("tools-menu").classList.toggle("hidden"); }

// --- ETİKET YÖNETİMİ ---
function addMusicTag() {
    if (isMusicMode) return;
    if (isImageMode) removeImageTag(); // Diğer modu kapat
    const tagsArea = document.getElementById("active-tags");
    const tag = document.createElement("div");
    tag.className = "tag"; tag.id = "music-tag";
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
    if (isMusicMode) removeMusicTag(); // Diğer modu kapat
    const tagsArea = document.getElementById("active-tags");
    const tag = document.createElement("div");
    tag.className = "tag"; tag.id = "image-tag";
    tag.innerHTML = `🖼️ Görsel Oluştur <span class="tag-close" onclick="removeImageTag()">×</span>`;
    tagsArea.appendChild(tag);
    isImageMode = true;
    document.getElementById("q").placeholder = "Nasıl bir görsel istersin?";
    toggleTools();
}

function removeImageTag() {
    const tag = document.getElementById("image-tag");
    if (tag) tag.remove();
    isImageMode = false;
    document.getElementById("q").placeholder = "Bir şeyler yazın...";
}

// --- ANA SOHBET VE ÜRETİM ---
async function talk() {
    if (isLoading) return;
    const qInput = document.getElementById("q");
    const val = qInput.value.trim();
    if (!val) return;

    isLoading = true;
    qInput.value = "";
    addMsg(val, "user");

    let statusMsg = "Düşünüyor...";
    if (isMusicMode) statusMsg = "🎵 Müzik besteleniyor...";
    if (isImageMode) statusMsg = "🖼️ Görsel çiziliyor...";
    const loadDiv = addMsg(statusMsg, "bot");

    try {
        if (isMusicMode) {
            // MUSICGEN API
            const resp = await fetch("https://api-inference.huggingface.co/models/facebook/musicgen-small", {
                headers: { Authorization: `Bearer ${HF_KEY}` },
                method: "POST", body: JSON.stringify({ inputs: val })
            });
            const blob = await resp.blob();
            loadDiv.remove();
            const audioBox = addMsg("İşte müziğin: ", "bot");
            const audio = document.createElement("audio");
            audio.src = URL.createObjectURL(blob); audio.controls = true;
            audioBox.appendChild(audio);
            removeMusicTag();
        } 
        else if (isImageMode) {
            // STABLE DIFFUSION API
            const resp = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0", {
                headers: { Authorization: `Bearer ${HF_KEY}` },
                method: "POST", body: JSON.stringify({ inputs: val })
            });
            const blob = await resp.blob();
            loadDiv.remove();
            const imgBox = addMsg("İşte görselin: ", "bot");
            const img = document.createElement("img");
            img.src = URL.createObjectURL(blob); img.className = "image-msg";
            imgBox.appendChild(img);
            removeImageTag();
        } 
        else {
            // GROQ CHAT API
            const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GK}` },
                body: JSON.stringify({
                    model: document.getElementById("model-select").value,
                    messages: [{ role: "system", content: "Sen zeki bir asistansın." }, { role: "user", content: val }]
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

// addMsg ve Keypress fonksiyonları aynı kalıyor...
