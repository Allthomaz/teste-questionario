// --- COPIE TODO ESTE CÓDIGO E SUBSTITUA O ANTERIOR NO APPS SCRIPT ---

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Aguarda até 10s para evitar conflitos de escrita simultânea

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // DEBUG: Se quiser ver o que está chegando, descomente a linha abaixo (cria logs na planilha)
    // sheet.appendRow(["DEBUG", JSON.stringify(e)]);

    var data;
    
    // Tenta ler os dados de diferentes formas para garantir compatibilidade
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      throw new Error("Nenhum dado recebido no corpo da requisição.");
    }

    // Validação básica
    if (!data.email) {
      throw new Error("Email não fornecido.");
    }

    // Lógica de verificação de retorno (Duplicidade)
    var email = data.email.toString().toLowerCase().trim();
    var tipoRegistro = "Primeiro";
    var dataFormatada = Utilities.formatDate(new Date(), "GMT-3", "dd/MM/yyyy HH:mm");
    
    var range = sheet.getDataRange();
    var values = range.getValues();
    
    // Procura o email na coluna C (índice 2)
    for (var i = 1; i < values.length; i++) {
      var rowEmail = values[i][2] ? values[i][2].toString().toLowerCase().trim() : "";
      if (rowEmail === email) {
        tipoRegistro = "Retorno";
        break;
      }
    }

    var statusFinal = tipoRegistro + " - " + dataFormatada;

    // Salva os dados
    sheet.appendRow([
      data.nome || "Não informado",
      statusFinal,
      data.email,
      data.nascimento || "",
      data.escore_inflamacao || 0,
      data.escore_risco_mental || 0,
      data.telefone || "",
      new Date() // Timestamp do sistema
    ]);

    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Em caso de erro, tenta salvar o erro na planilha para você ver o que houve
    try {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      sheet.appendRow(["ERRO", error.toString(), new Date()]);
    } catch(e) {}

    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } finally {
    lock.releaseLock();
  }
}
