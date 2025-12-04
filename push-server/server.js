const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// ====== CLAVES VAPID (PON TUS DOS CLAVES AQUÍ) ======
const publicVapidKey = "BI0yGOOX65GzWPS2atWV9LazcHnGAV-sEliAGLSk0VVw4dCIU6O651yoktDfrTyUu7XRqyDKy2ZDdyhiYXUdbgk";
const privateVapidKey = "cDp_ESZxuGlGajpKsU7yguCq1c7StAsM3QGamcJiTbk";

webpush.setVapidDetails(
    "mailto:tu-correo@example.com",
    publicVapidKey,
    privateVapidKey
);

// ----------------------------------------------------
// 1. RECIBIR SUSCRIPCIÓN DESDE LA PWA
// ----------------------------------------------------
app.post("/subscribe", (req, res) => {
    const subscription = req.body;

    console.log("👉 Nueva suscripción:", subscription);

    res.status(201).json({ message: "Suscripción recibida" });

    const payload = JSON.stringify({
        title: "¡Gracias por suscribirte!",
        body: "Ahora recibirás notificaciones 🍷",
        icon: "/img/icon-192.png"
    });

    webpush.sendNotification(subscription, payload).catch(err => {
        console.error("Error enviando notificación:", err);
    });
});

// ----------------------------------------------------
// 2. ENVIAR NOTIFICACIONES DESDE PANEL / API / MANUAL
// ----------------------------------------------------
app.post("/send", async (req, res) => {
    const { subscription, title, body } = req.body;

    if (!subscription) return res.status(400).json({ error: "Falta subscription" });

    const payload = JSON.stringify({
        title: title || "Notificación",
        body: body || "Mensaje desde el servidor",
    });

    try {
        await webpush.sendNotification(subscription, payload);
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "No se pudo enviar" });
    }
});

// ----------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 Servidor arriba en puerto " + PORT));
