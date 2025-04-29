const xlsx = require('xlsx');
const path = require('path');

// Datos de ejemplo para marcas
const brandsData = [
  { brandId: 863, name: 'Zwilling', isActive: true },
  { brandId: 1298, name: 'Zooz Pets', isActive: false }
];

// Convertir los datos a un formato adecuado para xlsx
const worksheet = xlsx.utils.json_to_sheet(brandsData, {header: ["brandId", "name", "isActive"]});
const workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(workbook, worksheet, 'Brands');

// Definir la ruta donde se guardará el archivo
const filePath = path.join(__dirname, 'templates/brands.xlsx');

// Guardar el archivo
xlsx.writeFile(workbook, filePath);

console.log('Archivo brands.xlsx generado exitosamente en', filePath);