const express = require('express');
const Jimp = require('jimp');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = 3000;

app.use(express.static('public'));  // Para servir CSS y otros archivos estáticos

// Ruta raíz para mostrar el formulario
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

// Ruta para procesar la imagen
app.get('/process-image', async (req, res) => {
    const imageUrl = req.query.url;
    try {
        const image = await Jimp.read(imageUrl);
        const processedImageName = `${uuidv4().slice(0, 8)}.jpeg`;

        await image
            .greyscale()  // Convertir a escala de grises
            .resize(350, Jimp.AUTO)  // Redimensionar
            .writeAsync(`public/images/${processedImageName}`);  // Guardar la imagen

        res.sendFile(__dirname + `/public/images/${processedImageName}`);
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).send('Error processing image');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
