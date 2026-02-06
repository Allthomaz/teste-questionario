/**
 * Serviço responsável por enviar os dados para a Planilha Google
 */

// ATENÇÃO: Substitua esta URL pela URL gerada na sua Implantação do Google Apps Script
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwdXhbxJFabslfdbc9-MiE3UiKmnQwnRomh62WIUDkGSOlvHoBT3eZW742hYM0shbuJFg/exec';

/**
 * Envia os dados do paciente para a planilha
 * @param {Object} patientData - Objeto com os dados do paciente e resultados
 * @returns {Promise<boolean>} - True se sucesso, False se erro
 */
export async function sendDataToSheet(patientData) {
    if (GOOGLE_SCRIPT_URL.includes('SUA_URL')) {
        console.warn('URL da API não configurada.');
        return false;
    }

    try {
        // Método "Simples e Eficaz": Enviar como texto puro sem keepalive
        // keepalive pode causar problemas em alguns cenários com no-cors
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(patientData)
        });

        console.log('Enviado para planilha. Verifique lá.');
        return true;
    } catch (error) {
        console.error('Falha no envio:', error);
        return false;
    }
}
