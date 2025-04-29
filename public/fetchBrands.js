$(document).ready(function() {
    $('#fetchBrands').click(function() {
      $.ajax({
        url: '/brands',
        method: 'GET',
        success: function(data) {
          const brandList = buildBrandList(data.data);
          $('#brandList').html(brandList);
        },
        error: function(error) {
          console.error('Error fetching brands:', error);
          $('#brandList').html('<p class="text-danger">Error al obtener el listado de marcas</p>');
        }
      });
    });
  
    function buildBrandList(brands) {
      if (!brands || brands.length === 0) {
        return '<p>No hay marcas disponibles</p>';
      }
  
      let listHtml = `
        <table class="table table-bordered table-hover">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Activo</th>
              <th>Fecha de Creación</th>
              <th>Fecha de Actualización</th>
            </tr>
          </thead>
          <tbody>
      `;
      brands.forEach(function(brand) {
        listHtml += `
          <tr>
            <td>${brand.id}</td>
            <td>${brand.name}</td>
            <td>${brand.isActive}</td>
            <td>${new Date(brand.createdAt).toLocaleString()}</td>
            <td>${new Date(brand.updatedAt).toLocaleString()}</td>
          </tr>
        `;
      });
      listHtml += `
          </tbody>
        </table>
      `;
      return listHtml;
    }
  });