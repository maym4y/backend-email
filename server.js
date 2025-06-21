const express = require("express");
const cors = require("cors");
const multer = require("multer");
const {
  enviarEmailObra,
  enviarEmailFiscalizacao,
} = require("./emailController");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

app.post("/enviar-email-obra", upload.single("imagem"), async (req, res) => {
  try {
    const dados = req.body;
    const imagem = req.file;

    await enviarEmailObra(dados, imagem);
    if (imagem?.path) {
      await fs.promises.unlink(imagem.path);
    }
    res.status(200).json({ message: "Email enviado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao enviar email" });
  }
});

app.post(
  "/enviar-email-fiscalizacao",
  upload.single("imagem"),
  async (req, res) => {
    try {
      const dados = req.body;
      const imagem = req.file;
      await enviarEmailFiscalizacao(dados, imagem);
      if (imagem?.path) {
        await fs.promises.unlink(imagem.path);
      }
      res.status(200).send("E-mail enviado com sucesso");
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  }
);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
