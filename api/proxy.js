// Carrega a URL do Google Script a partir das variáveis de ambiente
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

export default async function handler(req, res) {
    // 1. Permitir apenas requisições POST
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end('Method Not Allowed');
    }

    // 2. Validar a URL do Google Script
    if (!GOOGLE_SCRIPT_URL || !GOOGLE_SCRIPT_URL.startsWith('https://script.google.com/')) {
        console.error("Variável de ambiente GOOGLE_SCRIPT_URL não configurada ou inválida.");
        // Não expor o erro exato para o cliente por segurança
        return res.status(500).json({ success: false, error: "Server configuration error." });
    }

    try {
        // 3. Repassar os dados recebidos para o Google Script
        // Usamos fetch nativo (Node.js 18+)
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body) // O corpo da requisição já vem parseado pela Vercel
        });

        // 4. Analisar a resposta do Google Script
        // O Google Apps Script, ao redirecionar, indica sucesso.
        if (response.ok || response.status === 302) {
            console.log("Proxy: Dados enviados ao Google Script com sucesso.");
            return res.status(200).json({ success: true });
        } else {
            // Se o Google Script retornar um erro real
            const errorText = await response.text();
            console.error("Proxy: Google Script retornou um erro.", {
                status: response.status,
                statusText: response.statusText,
                body: errorText,
            });
            return res.status(response.status).json({ success: false, error: `Google Script error: ${errorText}` });
        }

    } catch (error) {
        // 5. Capturar erros de rede (ex: falha ao conectar no Google)
        console.error("Proxy: Erro de rede ao contatar o Google Script.", error);
        return res.status(500).json({ success: false, error: "Network error while contacting the data service." });
    }
}