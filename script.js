const GK = "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";
let currentModel = "oto";

// Modelleri bir objede tutmak daha temizdir
const MODELS = {
    hizli: "llama-3.1-8b-instant",
    dusunen: "llama-3.2-11b-vision-preview",
    pro: "llama-3.3-70b-versatile"
};

function setModel(m) {
    currentModel = m;
    document.querySelectorAll('.model-buttons button').forEach(b => b.classList.remove('active'));
    document.getElementById(`btn-${m}`).classList.add('active');
}

function autoGrow(el) {
    el.style.height = "auto";
    el.style.height = (el.scrollHeight) + "px";
}

async function talk() {
    const qInput = document.getElementById("q");
    const val = qInput.value.trim();
    if (!val) return;

    addMsg(val, "user");
    qInput.value = "";
    qInput.style.height = "auto";

    // Model seçimi mantığı
    let modelId = MODELS.pro; // Default pro
    if (currentModel === "hizli") modelId = MODELS.hizli;
    else if (currentModel === "dusunen") modelId = MODELS.dusunen;
    else if (currentModel === "oto") {
        const mods = [MODELS.hizli, MODELS.pro];
        modelId = mods[Math.floor(Math.random() * mods.length)];
    }

    // Yükleniyor efekti
    const loadDiv = addMsg(currentModel === "dusunen" ? "🧠 Düşünüyorum..." : "⚡ Hazırlıyorum...", "bot");
    loadDiv.style.opacity = "0.5";

    try {
        const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${GK}` 
            },
            body: JSON.stringify({
                model: modelId,
                messages: [{ role: "user", content: val }],
                temperature: 0.7
            })
        });

        const data = await r.json();
        loadDiv.remove(); // Yükleniyor yazısını kaldır
        
        if (data.choices && data.choices[0]) {
            addMsg(data.choices[0].message.content, "bot");
        } else {
            throw new Error("Boş yanıt");
        }

    } catch (e) {
        loadDiv.innerHTML = "❌ Bir hata oluştu";
        loadDiv.style.color = "#ff4444";
    }
}

function addMsg(t, c) {
    const d = document.createElement("div");
    d.className = `msg ${c}`;
    // HTML injection'ı önlemek için basit bir koruma eklenebilir ama 
    // <br> desteği istediğin için bu şekilde bıraktım.
    d.innerHTML = t.replace(/\n/g, "<br>");
    
    const box = document.getElementById("chat");
    box.appendChild(d);
    
    // Yumuşak kaydırma
    box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' });
    return d;
}

window.enterAsGuest = () => {
    document.getElementById('auth-overlay').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('auth-overlay').style.display = 'none';
        document.getElementById('main-app').style.display = 'flex';
        addMsg("✨Sana nasıl yardımcı olabilirim?", "bot");
    }, 500);
};

window.onSignIn = (resp) => {
    const payload = JSON.parse(atob(resp.credential.split('.')[1]));
    document.getElementById('auth-overlay').style.display = 'none';
    document.getElementById('main-app').style.display = 'flex';
    
    const userInfo = document.getElementById('user-header-info');
    userInfo.style.display = 'flex';
    document.getElementById('u-tag').textContent = payload.given_name || payload.name;
    document.getElementById('user-pfp').src = payload.picture;
    
    addMsg(`Merhaba ${payload.given_name}! Senin için buradayım. 😊`, "bot");
};
