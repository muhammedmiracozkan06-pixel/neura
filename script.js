const GK = "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";
const HF_KEY = "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";

let isLoading = false;
let isMusicMode = false;

// 1. Google Giriş Yanıtı
window.onSignIn = (resp) => {
    try {
        const payload = JSON.parse(atob(resp.credential.split('.')[1]));
        const name = payload.name || "Kullanıcı";
        const photo = payload.picture || "";
        enterApp(name, photo, "Google");
    } catch (e) {
        enterApp("Kullanıcı", "", "Google");
    }
};

// 2. Misafir Giriş Yanıtı
window.enterAsGuest = () => {
    enterApp("guest", "", "Guest");
};

// 3. Uygulamaya Giriş
function enterApp(name, photo, provider) {
    const overlay = document.getElementById("auth-overlay");
    const app = document.getElementById("main-app");
    const uTag = document.getElementById("u-tag");
    const pfpImg = document.getElementById("user-pfp");

    if (overlay) overlay.style.display = "none";
    if (app) app.style.display = "flex";

    if (provider === "Guest") {
        uTag.textContent = name;
        uTag.className = "guest-text";
        pfpImg.classList.add("hidden");
    } else {
        uTag.textContent = name;
        uTag.className = "";
        if (photo) {
            pfpImg.src = photo;
            pfpImg.classList.remove("hidden");
        }
    }
    
    addMsg("Sisteme giriş yapıldı. Hoş geldin " + name + "!", "bot");
}

// --- ARAÇLAR VE ETİKET YÖNETİMİ ---
function toggleTools() {
    document.getElementById("tools-menu").classList.toggle("hidden");
}

function addMusicTag() {
    if (isMusicMode) return;
    const tagsArea = document.getElementById("active-tags");
    const tag = document.createElement("div");
    tag.className = "tag";
    tag.id = "music-tag";
    tag.innerHTML = `🎵 Müzik Oluştur <span class="tag-close" onclick="removeMusicTag()">×</span>`;
    tagsArea.appendChild(tag);
    isMusicMode = true;
    document.getElementById("q").placeholder = "Nasıl bir müzik istersin? (örn: Lo-fi hip hop beat)";
    toggleTools();
}

function removeMusicTag() {
    const tag = document.getElementById("music-tag");
    if (tag) tag.remove();
    isMusicMode = false;
    document.getElementById("q").placeholder = "Bir şeyler yazın...";
}

// 4. Ana Sohbet ve Müzik Fonksiyonu
async function talk() {
    if (isLoading) return;
    const qInput = document.getElementById("q");
    const val = qInput.value.trim();
    const model = document.getElementById("model-select").value;

    if (!val) return;

    isLoading = true;
    qInput.value = "";
    addMsg(val, "user");
    
    const statusMsg = isMusicMode ? "🎵 Müzik besteleniyor (yaklaşık 30 sn)..." : "Düşünüyor...";
    const loadDiv = addMsg(statusMsg, "bot");

    if (isMusicMode) {
        // --- MÜZİK OLUŞTURMA (MUSICGEN) ---
        try {
            const response = await fetch("https://api-inference.huggingface.co/models/facebook/musicgen-small", {
                headers: { Authorization: `Bearer ${HF_KEY}` },
                method: "POST",
                body: JSON.stringify({ inputs: val }),
            });

            if (!response.ok) throw new Error("Müzik üretilemedi");

            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);
            loadDiv.remove();
            
            const audioBox = addMsg("İşte senin için bestelediğim müzik:", "bot");
            const audio = document.createElement("audio");
            audio.controls = true;
            audio.src = audioUrl;
            audio.style.marginTop = "10px";
            audio.style.width = "100%";
            audioBox.appendChild(audio);
            
            removeMusicTag(); // İşlem bitince modu kapat
        } catch (e) {
            loadDiv.innerHTML = "❌ Müzik oluşturma sırasında bir hata oluştu.";
        }
    } else {
        // --- NORMAL SOHBET (GROQ) ---
        try {
            const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${GK}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: "system", content: "Sen yardımcı, nazik ve akıllı bir asistansın. Türkçe konuşuyorsun." },
                        { role: "user", content: val }
                    ]
                })
            });

            const data = await r.json();
            loadDiv.remove();
            
            if (data.choices && data.choices[0]) {
                addMsg(data.choices[0].message.content, "bot");
            } else {
                addMsg("Hata: Yanıt alınamadı.", "bot");
            }
        } catch (e) {
            if (loadDiv) loadDiv.remove();
            addMsg("Bağlantı hatası!", "bot");
        }
    }
    isLoading = false;
}

// 5. Mesaj Ekleme
function addMsg(txt, cls) {
    const d = document.createElement("div");
    d.className = `msg ${cls}`;
    d.innerHTML = txt.replace(/\n/g, "<br>");
    const box = document.getElementById("chat");
    box.appendChild(d);
    box.scrollTop = box.scrollHeight;
    return d;
}

// Enter Tuşu
document.getElementById("q").addEventListener("keypress", (e) => {
    if (e.key === "Enter") talk();
});
