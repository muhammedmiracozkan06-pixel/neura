// --- ANAHTARLAR VE AYARLAR ---
const GK = "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";
const HF_KEY = "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"; 
const MY_MODEL_ID = "muhamsdadefwf/Neura_MAX_1_Final";

// CLOUDFLARE AYARLARIN
const CF_ACCOUNT_ID = "922158fb1068d0a8d0e20a93c3bb4492";
const CF_API_TOKEN = "ga9hqQPaU9uo-Xf-rHZc5VVggsY_mqynoyCWtdyI"; // Senin aldığın token

// --- talk() FONKSİYONU İÇİNDEKİ NEURA KISMI ---
// talk fonksiyonu içindeki 'else' bloğunun içindeki 'if (modelChoice === "neura-max-1")' bölümünü bununla değiştir:

if (modelChoice === "neura-max-1") {
    try {
        const r = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@hf/muhamsdadefwf/Neura_MAX_1_Final`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${CF_API_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: "Sen  (Wind Developer) tarafından eğitilen Neura MAX-1'sin. Zeki ve nazik bir asistansın." },
                        { role: "user", content: val }
                    ]
                })
            }
        );

        const data = await r.json();
        loadDiv.remove();

        if (data.success) {
            // Cloudflare yanıtı 'result.response' içinde verir
            addMsg(data.result.response, "bot");
        } else {
            console.error("Cloudflare Hatası:", data);
            addMsg("Cloudflare: Model bulunamadı veya erişim reddedildi. Lütfen Hugging Face modelinin 'Public' olduğundan emin ol.", "bot");
        }
    } catch (e) {
        console.error("Bağlantı Hatası:", e);
        if (loadDiv) loadDiv.remove();
        addMsg("❌ Cloudflare sunucusuna bağlanılamadı.", "bot");
    }
}
