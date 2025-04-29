const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const xlsx = require('xlsx');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const upload = multer({ dest: 'uploads/' });

// Configuración VTEX
const account = "tekno415"; // Reemplaza con tu cuenta VTEX
const authCookie = "eyJhbGciOiJFUzI1NiIsImtpZCI6IkM1OUU5NzkwNDhGQTQ3Q0I3QzVEMEQ2Q0VDQzVCRDU1RDNFQjVENjgiLCJ0eXAiOiJqd3QifQ.eyJzdWIiOiJuaWNvbGFzLm9zcGluYUB2dGV4LmNvbSIsImFjY291bnQiOiJ0ZWtubzQxNSIsImF1ZGllbmNlIjoiYWRtaW4iLCJzZXNzIjoiOGMzOTdiZDItODZlNy00ZDE4LWJiODctZTlhMWFmZDgyMzU1IiwiZXhwIjoxNzQ1OTMzNjk5LCJ0eXBlIjoidXNlciIsInVzZXJJZCI6IjQxMzE2NTAwLTc3ZTEtNDg0NC1iOTI3LWZkMTY4NzlhMjUzNyIsImlhdCI6MTc0NTg0NzI5OSwiaXNSZXByZXNlbnRhdGl2ZSI6ZmFsc2UsImlzcyI6InRva2VuLWVtaXR0ZXIiLCJqdGkiOiI3YTVjNjViZi01YTYyLTRiN2ItYTFmOS0zMmIyOGY4NzBjZWQifQ.pMsmSHfXW1sN_pRkfCL-3g4-Be14TLXLbMbrgkHpl7voUnHJ8wGlGP4y6K_dw5uhLqmmXFy-YuxXuUaCpWrpOg"; // Reemplaza con tu VtexAuthcookie

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para descargar la plantilla de categorías
app.get('/template-categories', (req, res) => {
  const templatePath = path.join(__dirname, 'templates/template-categories.xlsx');
  if (!fs.existsSync(templatePath)) {
    // Generar la plantilla si no existe
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.aoa_to_sheet([
      ["ParentID", "Name"],
      ["567", "Beauty"]
    ]);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Categories');
    xlsx.writeFile(workbook, templatePath);
  }
  res.download(templatePath, 'template-categories.xlsx');
});

// Ruta para subir la plantilla de categorías y ejecutar el script de importación
app.post('/upload-categories', upload.single('categoryFile'), (req, res) => {
  const filePath = req.file.path;
  const newFilePath = path.join(__dirname, 'templates/template-categories.xlsx');
  fs.renameSync(filePath, newFilePath);

  exec('node uploadCategories.js', (err, stdout, stderr) => {
    if (err) {
      console.error('Error ejecutando uploadCategories.js:', err);
      return res.status(500).send('Error al subir las categorías');
    }
    res.send('<p>Categorías subidas correctamente</p><a href="/">Regresar al menú principal</a>');
  });
});

// Ruta para descargar la plantilla de marcas
app.get('/template-brands', (req, res) => {
  const templatePath = path.join(__dirname, 'templates/template-brands.xlsx');
  if (!fs.existsSync(templatePath)) {
    // Generar la plantilla si no existe
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.aoa_to_sheet([
      ["Name", "IsActive"],
      ["Zwilling", "true"]
    ]);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Brands');
    xlsx.writeFile(workbook, templatePath);
  }
  res.download(templatePath, 'template-brands.xlsx');
});

// Ruta para subir la plantilla de marcas y ejecutar el script de importación
app.post('/upload-brands', upload.single('brandFile'), (req, res) => {
  const filePath = req.file.path;
  const newFilePath = path.join(__dirname, 'templates/template-brands.xlsx');
  fs.renameSync(filePath, newFilePath);

  exec('node uploadBrands.js', (err, stdout, stderr) => {
    if (err) {
      console.error('Error ejecutando uploadBrands.js:', err);
      return res.status(500).send('Error al subir las marcas');
    }
    res.send('<p>Marcas subidas correctamente</p><a href="/">Regresar al menú principal</a>');
  });
});

// Ruta para obtener el árbol de categorías
app.get('/categories', async (req, res) => {
  try {
    const categoryTreeUrl = `https://${account}.vtexcommercestable.com.br/api/catalog-seller-portal/category-tree`;
    const response = await axios.get(categoryTreeUrl, {
      headers: {
        'Accept': 'application/json',
        'VtexIdclientAutCookie': authCookie
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching category tree:', error);
    res.status(500).send('Error al obtener el árbol de categorías');
  }
});

// Ruta para obtener el listado de marcas
app.get('/brands', async (req, res) => {
  try {
    const brandsUrl = `https://${account}.vtexcommercestable.com.br/api/catalog-seller-portal/brands`;
    const response = await axios.get(brandsUrl, {
      headers: {
        'Accept': 'application/json',
        'VtexIdclientAutCookie': authCookie
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).send('Error al obtener el listado de marcas');
  }
});

// Ruta para descargar las categorías en formato XLSX
app.get('/download-categories', async (req, res) => {
  try {
    const categoryTreeUrl = `https://${account}.vtexcommercestable.com.br/api/catalog-seller-portal/category-tree`;
    const response = await axios.get(categoryTreeUrl, {
      headers: {
        'Accept': 'application/json',
        'VtexIdclientAutCookie': authCookie
      }
    });
    const categories = [];
    function traverse(categoriesList, parentId = '') {
      categoriesList.forEach(category => {
        categories.push({
          categoryId: category.value.id,
          parentId: parentId,
          name: category.value.name,
          isActive: category.value.isActive,
          isDepartment: !parentId
        });
        if (category.children && category.children.length > 0) {
          traverse(category.children, category.value.id);
        }
      });
    }
    traverse(response.data.roots);

    const worksheet = xlsx.utils.json_to_sheet(categories);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Categories');
    const filePath = path.join(__dirname, 'templates/categories.xlsx');
    xlsx.writeFile(workbook, filePath);
    res.download(filePath, 'categories.xlsx');
  } catch (error) {
    console.error('Error downloading categories:', error);
    res.status(500).send('Error al descargar las categorías');
  }
});

// Ruta para descargar las marcas en formato XLSX
app.get('/download-brands', async (req, res) => {
  try {
    const brandsUrl = `https://${account}.vtexcommercestable.com.br/api/catalog-seller-portal/brands`;
    const response = await axios.get(brandsUrl, {
      headers: {
        'Accept': 'application/json',
        'VtexIdclientAutCookie': authCookie
      }
    });
    const brands = response.data.data.map(brand => ({
      brandId: brand.id,
      name: brand.name,
      isActive: brand.isActive
    }));
    const worksheet = xlsx.utils.json_to_sheet(brands);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Brands');
    const filePath = path.join(__dirname, 'templates/brands.xlsx');
    xlsx.writeFile(workbook, filePath);
    res.download(filePath, 'brands.xlsx');
  } catch (error) {
    console.error('Error downloading brands:', error);
    res.status(500).send('Error al descargar las marcas');
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});