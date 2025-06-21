// emailController.js
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

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

  // Configuração do transporte SMTP
  const transporter = nodemailer.createTransport({
    host: "",
    port: "",
    secure: false,
    auth: {
      user: 'SEU_EMAIL@gmail.com',
      pass: 'SENHA_DO_APLICATIVO', // use app password (não senha pessoal)
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
    from: 'SEU_EMAIL@gmail.com',
    to: destinatario,
    subject: `Obra: ${nome}`,
    html: html,
    attachments: [
      {
        filename: imagem.originalname,
        path: path.resolve(imagem.path),
      },
    ],
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { enviarEmailObra };
