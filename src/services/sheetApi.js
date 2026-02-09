const PROXY_URL = '/api/proxy';

export async function sendDataToSheet(patientData) {
    try {
        const response = await fetch(PROXY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Definir Content-Type para JSON para o proxy
            },
            body: JSON.stringify(patientData)
        });

        // O proxy deve retornar um status indicando sucesso ou falha
        if (response.ok) {
            console.log("Dados enviados com sucesso via proxy.");
            return true;
        } else {
            const errorText = await response.text();
            console.error(`Falha no envio via proxy: ${response.status} - ${errorText}`);
            return false;
        }
    } catch (error) {
        console.error('Falha no envio:', error);
        return false;
    }
}
