const xlsx = require('xlsx');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuración VTEX
const account = "tekno415"; // Reemplaza con tu cuenta VTEX
const authCookie = "eyJhbGciOiJFUzI1NiIsImtpZCI6IkM1OUU5NzkwNDhGQTQ3Q0I3QzVEMEQ2Q0VDQzVCRDU1RDNFQjVENjgiLCJ0eXAiOiJqd3QifQ.eyJzdWIiOiJuaWNvbGFzLm9zcGluYUB2dGV4LmNvbSIsImFjY291bnQiOiJ0ZWtubzQxNSIsImF1ZGllbmNlIjoiYWRtaW4iLCJzZXNzIjoiOGMzOTdiZDItODZlNy00ZDE4LWJiODctZTlhMWFmZDgyMzU1IiwiZXhwIjoxNzQ1OTMzNjk5LCJ0eXBlIjoidXNlciIsInVzZXJJZCI6IjQxMzE2NTAwLTc3ZTEtNDg0NC1iOTI3LWZkMTY4NzlhMjUzNyIsImlhdCI6MTc0NTg0NzI5OSwiaXNSZXByZXNlbnRhdGl2ZSI6ZmFsc2UsImlzcyI6InRva2VuLWVtaXR0ZXIiLCJqdGkiOiI3YTVjNjViZi01YTYyLTRiN2ItYTFmOS0zMmIyOGY4NzBjZWQifQ.pMsmSHfXW1sN_pRkfCL-3g4-Be14TLXLbMbrgkHpl7voUnHJ8wGlGP4y6K_dw5uhLqmmXFy-YuxXuUaCpWrpOg"; // Reemplaza con tu VtexAuthcookie

// Función para leer la plantilla y realizar las solicitudes POST
async function uploadCategories() {
  const filePath = path.join(__dirname, 'templates/template-categories.xlsx');
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: '' });

  for (const row of jsonData) {
    const categoryPayload = {
      parentId: row.ParentID.toString(),
      Name: row.Name.toString()
    };

    try {
      const categoryCreationUrl = `https://${account}.vtexcommercestable.com.br/api/catalog-seller-portal/category-tree/categories`;
      const response = await axios.post(categoryCreationUrl, categoryPayload, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'VtexIdclientAutCookie': authCookie
        }
      });
      console.log(`Categoría creada: ${categoryPayload.Name}, ID: ${response.data.Id}`);
    } catch (apiError) {
      console.error(`Error creando categoría ${categoryPayload.Name}:`, apiError.message);
    }
  }
}

// Ejecutar la función
uploadCategories();