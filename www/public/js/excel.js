const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.raw({ type: 'application/octet-stream', limit: '10mb' }));

// Manejar la solicitud PUT para sobrescribir el archivo existente
app.put('public/excel/F-PSE-DICA-A-260022100001_Inventario_de_laboratorios_e_insumos.xlsx', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'excel', 'F-PSE-DICA-A-260022100001_Inventario_de_laboratorios_e_insumos.xlsx');
    
    fs.writeFile(filePath, req.body, (err) => {
        if (err) {
            console.error('Error al guardar el archivo:', err);
            return res.status(500).send('Error al guardar el archivo');
        }
        res.send('Archivo guardado exitosamente');
    });
});

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
