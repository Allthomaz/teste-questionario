import { initializeForm, showStep, validateStep, displayResults, generatePDF } from './dom.js';
import { calculateInflammationScore, calculateMentalRiskScore, inflammationData, mentalRiskData } from './logic.js';
import { sendDataToSheet } from './services/sheetApi.js';
import { inject } from '@vercel/analytics';

inject();

let currentStep = 1;
const totalSteps = 4;

// ATENÇÃO: Constante solicitada (mas a lógica real de envio está encapsulada em sheetApi.js para manter a organização)
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxgxuM0cpAivKmrGCoP458olgXcuOiagbQTogxtwNMrnQficO26zbrWQXxLC7P_lSeOPA/exec';

// Inicializa o formulário ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    console.log("App initialized v2 - PDF Fix Applied");
    initializeForm();
    updateProgress();
    
    // Listener para o envio do formulário
    const form = document.getElementById('questionnaireForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Previne recarregamento da página
            await sendResults();
        });
    }

    // Listener para o botão de PDF
    const btnPdf = document.getElementById('btn-pdf');
    if (btnPdf) {
        btnPdf.addEventListener('click', () => {
            generatePDF(inflammationData, mentalRiskData);
        });
    }
});

// Navegação
document.getElementById('nextBtn').addEventListener('click', async () => {
    if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
            updateProgress();
            
            // Se chegou ao último passo (Resultados), calcula e exibe (mas não envia ainda)
            if (currentStep === 4) {
                calculateAndDisplayResults();
            }
        }
    }
});

document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        updateProgress();
    }
});

function updateProgress() {
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    document.getElementById('progress-text').innerText = `${Math.round(progress)}%`;
}

/**
 * Apenas calcula e exibe os resultados na tela (sem enviar)
 */
function calculateAndDisplayResults() {
    // 0. Coletar respostas do formulário
    const form = document.getElementById('questionnaireForm');
    const formData = new FormData(form);
    
    const inflammationAnswers = [];
    const mentalRiskAnswers = [];
    
    let globalIndex = 0;
    
    // Coleta inflamação (estrutura aninhada)
    inflammationData.forEach(category => {
        category.questions.forEach(() => {
            const val = formData.get(`inflamacao_${globalIndex}`);
            inflammationAnswers.push(val ? parseInt(val) : 0);
            globalIndex++;
        });
    });
    
    // Coleta risco mental (estrutura plana)
    mentalRiskData.forEach(() => {
        const val = formData.get(`risco_mental_${globalIndex}`);
        mentalRiskAnswers.push(val ? parseInt(val) : 0);
        globalIndex++;
    });

    // 1. Calcular Escores
    const inflammationScore = calculateInflammationScore(inflammationAnswers);
    const mentalRiskScore = calculateMentalRiskScore(mentalRiskAnswers);

    // 2. Exibir na Tela
    displayResults(
        inflammationScore.total, 
        mentalRiskScore.total, 
        inflammationScore.level, 
        mentalRiskScore.level
    );
    
    // Atualizar campos hidden para o PDF e envio
    document.getElementById('escore_inflamacao').value = inflammationScore.total;
    document.getElementById('nivel_inflamacao').value = inflammationScore.level;
    document.getElementById('escore_risco_mental').value = mentalRiskScore.total;
    document.getElementById('nivel_risco_mental').value = mentalRiskScore.level;
    
    return { inflammationScore, mentalRiskScore };
}

/**
 * Coleta os dados e envia para a planilha (chamado no submit)
 */
async function sendResults() {
    // Coleta os valores JÁ CALCULADOS dos campos hidden (fonte de verdade do que o usuário vê)
    const escoreInflamacao = parseInt(document.getElementById('escore_inflamacao').value) || 0;
    const escoreRiscoMental = parseInt(document.getElementById('escore_risco_mental').value) || 0;

    // Formatar data de nascimento para o padrão brasileiro (DD/MM/YYYY)
    const rawNascimento = document.getElementById('nascimento').value;
    const nascimentoFormatado = rawNascimento ? rawNascimento.split('-').reverse().join('/') : "";

    // 3. Coletar Dados do Paciente
    const patientData = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        nascimento: nascimentoFormatado,
        telefone: document.getElementById('telefone').value,
        escore_inflamacao: escoreInflamacao,
        escore_risco_mental: escoreRiscoMental
    };

    // 4. Enviar para Planilha (Google Sheets)
    const submitButton = document.getElementById('submitButton');
    const originalBtnText = submitButton.innerText;
    
    submitButton.innerText = "Enviando...";
    submitButton.disabled = true;

    sendDataToSheet(patientData)
        .then(success => {
            if (success) {
                console.log("Dados sincronizados com a planilha.");
                document.getElementById('submit-status').innerText = "Dados enviados com sucesso!";
                document.getElementById('submit-status').className = "mt-4 text-sm text-green-600 h-5";
                
                // Muda a cor do botão para verde
                submitButton.classList.remove('bg-green-600', 'hover:bg-green-700');
                submitButton.classList.add('bg-green-500', 'hover:bg-green-600');
                submitButton.innerText = "Enviado!";
            } else {
                throw new Error("Falha no envio (retornou false)");
            }
        })
        .catch(error => {
            console.error("Erro de rede ou lógica:", error);
            console.log("Atenção: Configure a URL da planilha em src/services/sheetApi.js");
            document.getElementById('submit-status').innerText = "Erro ao enviar. Tente novamente.";
            document.getElementById('submit-status').className = "mt-4 text-sm text-red-600 h-5";
            submitButton.innerText = originalBtnText;
            submitButton.disabled = false;
        });
}
