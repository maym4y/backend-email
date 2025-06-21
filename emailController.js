const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
require("dotenv/config");

async function enviarEmailObra(dados, imagem) {
  const {
    nome,
    responsavel,
    local,
    descricao,
    dataInicio,
    previsaoConclusao,
    destinatario,
  } = dados;

  const dataInicioFormatada = new Date(dataInicio).toLocaleDateString("pt-BR");
  const dataConclusaoFormatada = new Date(previsaoConclusao).toLocaleDateString(
    "pt-BR"
  );

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = `
    <h2>🏗️ Obra </h2>
    <ul>
      <li><strong>Nome:</strong> ${nome}</li>
      <li><strong>Responsável:</strong> ${responsavel}</li>
      <li><strong>Local:</strong> ${local}</li>
      <li><strong>Descrição:</strong> ${descricao}</li>
      <li><strong>Data de Início:</strong> ${dataInicioFormatada}</li>
      <li><strong>Previsão de Conclusão:</strong> ${dataConclusaoFormatada}</li>
    </ul>
    <p><strong>Imagem:</strong></p>
    <img src="cid:imagemObra" style="max-width: 500px;" />
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: destinatario,
    subject: `Obra: ${nome}`,
    html: html,
    attachments: [
      {
        filename: imagem.originalname,
        path: path.resolve(imagem.path),
        contentType: imagem.mimetype || "image/jpeg",
        cid: "imagemObra"
      },
    ],
  };
  console.log("Imagem:", mailOptions.attachments);

  await transporter.sendMail(mailOptions);
}

async function enviarEmailFiscalizacao(dados, imagem) {
  const { data, status, observacoes, local, destinatario, nomeObra } = dados;

  const dataFormatada = new Date(data).toLocaleDateString("pt-BR");

  const html = `
    <h2>📋 Fiscalização: ${nomeObra}</h2>
    <ul>
      <li><strong>Data:</strong> ${dataFormatada}</li>
      <li><strong>Status:</strong> ${status}</li>
      <li><strong>Local:</strong> ${local}</li>
      <li><strong>Observações:</strong> ${observacoes}</li>
    </ul>
    <p><strong>Imagem:</strong></p>
    <img src="cid:imagemFiscal" style="max-width: 500px;" />
  `;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const attachments = imagem
    ? [
        {
          filename: imagem.originalname,
          path: path.resolve(imagem.path),
          contentType: imagem.mimetype || "image/jpeg",
          cid: "imagemFiscal"
        },
      ]
    : [];

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: destinatario,
    subject: `Fiscalização: ${nomeObra}`,
    html,
    attachments,
  });
}

module.exports = { enviarEmailObra, enviarEmailFiscalizacao };
