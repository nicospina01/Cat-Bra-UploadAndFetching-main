const xlsx = require('xlsx');
const path = require('path');

// Datos de ejemplo para categorías
const categoriesData = [
  { categoryId: 1, parentId: null, name: 'Beauty', isActive: true, isDepartment: true },
  { categoryId: 2, parentId: 1, name: 'Skincare', isActive: true, isDepartment: false },
  { categoryId: 3, parentId: 1, name: 'Makeup', isActive: false, isDepartment: false }
];

// Convertir los datos a un formato adecuado para xlsx
const worksheet = xlsx.utils.json_to_sheet(categoriesData, {header: ["categoryId", "parentId", "name", "isActive", "isDepartment"]});
const workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(workbook, worksheet, 'Categories');

// Definir la ruta donde se guardará el archivo
const filePath = path.join(__dirname, 'templates/categories.xlsx');

// Guardar el archivo
xlsx.writeFile(workbook, filePath);

console.log('Archivo categories.xlsx generado exitosamente en', filePath);