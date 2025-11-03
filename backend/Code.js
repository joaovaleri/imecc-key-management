function doPost(e) {
  

  const rawData = e.postData.contents;

  const data = {};
  rawData.split("&").forEach(pair => {
    const [key, val] = pair.split("=");
    data[decodeURIComponent(key)] = decodeURIComponent(val || "");
  });
if (data.id_token) {
  const idToken = data.id_token;

  const url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;
  const response = UrlFetchApp.fetch(url);
  const payload = JSON.parse(response.getContentText());

  const email = payload.email;
  const nome = payload.name;

  if (email && email.endsWith("@unicamp.br")) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      email: email,
      nome: nome
    })).setMimeType(ContentService.MimeType.PLAIN);
  } else {
    return ContentService.createTextOutput(JSON.stringify({
      status: "unauthorized"
    })).setMimeType(ContentService.MimeType.PLAIN);
  }
}

const credenciais = {
    "-": "-",
    "-": "-"
  };

  const usuario = data.usuario;
  const senha = data.senha;

  if (usuario && senha && !data.ra && !data.chave && !data.nome) {
    if (
      usuario.trim() !== "" &&
      senha.trim() !== "" &&
      credenciais.hasOwnProperty(usuario) &&
      credenciais[usuario] === senha
    ) {
      return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
        .setMimeType(ContentService.MimeType.PLAIN);
    } else {
      return ContentService.createTextOutput(JSON.stringify({ status: "error" }))
        .setMimeType(ContentService.MimeType.PLAIN);
    }
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const inputSheet = ss.getSheetByName("Input");
  const dataSheet = ss.getSheetByName("Data");

  if (data.listar_alunos === "true") {
    try {

      var lastRow = dataSheet.getLastRow();
      var numRows = Math.max(0, lastRow - 1);
      var alunos = [];

      if (numRows > 0) {
        var values = dataSheet.getRange(2, 1, numRows, 2).getValues(); // A:B
        alunos = values
          .filter(function (r) { return r[0] && r[1]; })
          .map(function (r) {
            return { nome: String(r[0]).trim(), ra: String(r[1]).trim() };
          });
      }

      return ContentService
        .createTextOutput(JSON.stringify({ status: "success", alunos: alunos }))
        .setMimeType(ContentService.MimeType.PLAIN); 
    } catch (err) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "error", message: String(err) }))
        .setMimeType(ContentService.MimeType.PLAIN);
    }
  }

  const ra = data.ra;
  const chave = data.chave ? data.chave.replace(/\s+/g, '') : null;
  const nome = data.nome;
  const horario = new Date();
  const inputData = inputSheet.getDataRange().getValues();
  const inputLen = inputData.length;

 
  if (data.busca_ra) {
    const raBuscado = data.busca_ra;
    const values = dataSheet.getRange(2, 1, dataSheet.getLastRow() - 1, 4).getValues();

    for (let i = 0; i < values.length; i++) {
      if (values[i][1] == raBuscado) { 
        const nome = values[i][0];     
        return ContentService.createTextOutput(JSON.stringify({ nome }))
          .setMimeType(ContentService.MimeType.PLAIN);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ nome: null }))
      .setMimeType(ContentService.MimeType.PLAIN);
  }

if (chave && !ra && !nome) {
  
  function generateRangeQ1(start, end) {
    const range = [];
    for (let i = start; i <= end; i++) {
      range.push(i + "Q1");
    }
    return range;
  }

  const keysMap = {
    "1ANDARSEG": generateRangeQ1(101, 116),
    "2ANDARSEG": generateRangeQ1(201, 215),
    "3ANDARSEG": generateRangeQ1(301, 315),
    "1ANDARTER": generateRangeQ1(117, 140),
    "2ANDARTER": generateRangeQ1(216, 240),
    "3ANDARTER": generateRangeQ1(316, 340),
    "1ANDARQUA": generateRangeQ1(141, 147).concat(["147AQ1", "147BQ1", "147CQ1", "147DQ1"]),
    "2ANDARQUA": generateRangeQ1(241, 248).concat(["248AQ1", "248BQ1"]),
    "3ANDARQUA": generateRangeQ1(341, 348).concat(["348AQ1", "348BQ1"])
  };

  const chavesParaDevolver = keysMap[chave.toUpperCase()] || [chave.trim()];
  let algumaDevolvida = false;

  for (let i = 1; i < inputLen; i++) {
    let chavePlanilha = String(inputData[i][1]).trim();
    if (chavesParaDevolver.includes(chavePlanilha) && inputData[i][5] !== "Sim") {
      inputSheet.getRange(i + 1, 6, 1, 2).setValues([["Sim", horario]]);
      algumaDevolvida = true;
    }
  }

  if (algumaDevolvida) {
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.PLAIN);
  } else {
    return ContentService.createTextOutput(JSON.stringify({ status: "sucess" }))
      .setMimeType(ContentService.MimeType.PLAIN);
  }
}



if (ra && chave && !nome) {
  
  function generateRangeQ1(start, end) {
    const range = [];
    for (let i = start; i <= end; i++) {
      range.push(i + "Q1");
    }
    return range;
  }

  const keysMap = {
    "1ANDARSEG": generateRangeQ1(101, 116),
    "2ANDARSEG": generateRangeQ1(201, 215),
    "3ANDARSEG": generateRangeQ1(301, 315),
    "1ANDARTER": generateRangeQ1(117, 140),
    "2ANDARTER": generateRangeQ1(216, 240),
    "3ANDARTER": generateRangeQ1(316, 340),
    "1ANDARQUA": generateRangeQ1(141, 147).concat(["147AQ1", "147BQ1", "147CQ1", "147DQ1"]),
    "2ANDARQUA": generateRangeQ1(241, 248).concat(["248AQ1", "248BQ1"]),
    "3ANDARQUA": generateRangeQ1(341, 348).concat(["348AQ1", "348BQ1"])
  };

  let chavesRegistradas = [];

  if (chave.includes(",")) {
    chavesRegistradas = chave.split(",").map(c => c.trim());
  } else {
    const expandida = keysMap[chave.toUpperCase()];
    chavesRegistradas = expandida || [chave.trim()];
  }

  const dataValues = dataSheet.getRange(2, 1, dataSheet.getLastRow() - 1, 4).getValues();
  let nomeEncontrado = "", responsavelEncontrado = "";

  for (let i = 0; i < dataValues.length; i++) {
    if (dataValues[i][1] == ra) {
      responsavelEncontrado = dataValues[i][0];
      nomeEncontrado = dataValues[i][3];
      break;
    }
  }

  let naoRegistradas = [];
  let linhasParaInserir = [];

  for (let i = 0; i < chavesRegistradas.length; i++) {
    const chaveAtual = chavesRegistradas[i];
    let jaEstaEmprestada = false;

    for (let j = 1; j < inputLen; j++) {
      if (inputData[j][1] == chaveAtual && inputData[j][5] !== "Sim") {
        jaEstaEmprestada = true;
        break;
      }
    }

    if (jaEstaEmprestada) {
      naoRegistradas.push(chaveAtual);
    } else {
      linhasParaInserir.push([ra, chaveAtual, horario, nomeEncontrado, responsavelEncontrado, "", ""]);
    }
  }

 if (linhasParaInserir.length > 0) {
  const colA = inputSheet.getRange(1, 1, inputSheet.getMaxRows(), 1).getValues();

  let linhaAtual = -1;

  for (let i = 0; i < colA.length; i++) {
    if (!colA[i][0] || colA[i][0].toString().trim() === "") {
      linhaAtual = i + 1;
      break;
    }
  }

  if (linhaAtual === -1) {
    linhaAtual = inputSheet.getLastRow() + 1;
  }

  const faltamLinhas = linhaAtual + linhasParaInserir.length - 1 - inputSheet.getMaxRows();
  if (faltamLinhas > 0) {
    inputSheet.insertRowsAfter(inputSheet.getMaxRows(), faltamLinhas);
  }

  for (let i = 0; i < linhasParaInserir.length; i++) {
    inputSheet.getRange(linhaAtual + i, 1, 1, 7).setValues([linhasParaInserir[i]]);
  }
}


  if (naoRegistradas.length === chavesRegistradas.length) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Nenhuma chave foi registrada. As seguintes chaves já estão emprestadas: " + naoRegistradas.join(", ")
    })).setMimeType(ContentService.MimeType.PLAIN);
  } else if (naoRegistradas.length > 0) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "partial",
      message: "Algumas chaves não foram registradas pois já estão emprestadas: " + naoRegistradas.join(", ")
    })).setMimeType(ContentService.MimeType.PLAIN);
  } else {
    return ContentService.createTextOutput(JSON.stringify({
      status: "success"
    })).setMimeType(ContentService.MimeType.PLAIN);
  }
}

  if (nome && ra && !chave) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data");
    const lastRow = sheet.getLastRow();
    let nextRow = lastRow + 1;

    const dataRange = sheet.getRange(1, 1, sheet.getMaxRows(), 1).getValues();
    for (let i = 0; i < dataRange.length; i++) {
      if (dataRange[i][0] === "") {
        nextRow = i + 1;
        break;
      }
    }

    sheet.getRange(nextRow, 1).setValue(nome);
    sheet.getRange(nextRow, 2).setValue(ra);

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.PLAIN);
  }

  return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.PLAIN);

}
