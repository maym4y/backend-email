const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv/config');

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
      <li><strong>Data de Início:</strong> ${dataInicio}</li>
      <li><strong>Previsão de Conclusão:</strong> ${previsaoConclusao}</li>
    </ul>
    <p><strong>Imagem:</strong> em anexo.</p>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: destinatario,
    subject: `Obra: ${nome}`,
    html: html,
    attachments: [
      {
        filename: imagem.originalname,
        path: imagem.path,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
}

async function enviarEmailFiscalizacao(dados, imagem) {
  const { data, status, observacoes, localizacao, destinatario } = dados;

  const html = `
    <h2>📋 Fiscalização</h2>
    <ul>
      <li><strong>Data:</strong> ${data}</li>
      <li><strong>Status:</strong> ${status}</li>
      <li><strong>Local:</strong> ${localizacao}</li>
      <li><strong>Observações:</strong> ${observacoes}</li>
    </ul>
    <p><strong>Imagem:</strong> em anexo.</p>
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
    ? [{ filename: imagem.originalname, path: imagem.path }]
    : [];

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: destinatario,
    subject: `Fiscalização: ${data}`,
    html,
    attachments,
  });
}


module.exports = { enviarEmailObra, enviarEmailFiscalizacao };
