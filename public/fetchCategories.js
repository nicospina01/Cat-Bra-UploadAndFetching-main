$(document).ready(function() {
    $('#fetchCategories').click(function() {
      $.ajax({
        url: '/categories',
        method: 'GET',
        success: function(data) {
          const maxId = getMaxCategoryId(data.roots);
          const categoryTree = buildCategoryTree(data.roots, 0);
          $('#categoryTree').html(categoryTree);
          $('#maxCategoryId').html(`<strong>Último ID de Categoría (Mayor):</strong> ${maxId}`);
        },
        error: function(error) {
          console.error('Error fetching categories:', error);
          $('#categoryTree').html('<p class="text-danger">Error al obtener el árbol de categorías</p>');
        }
      });
    });
  
    function getMaxCategoryId(categories) {
      let maxId = 0;
      function traverse(categories) {
        if (!categories || categories.length === 0) return;
        categories.forEach(function(category) {
          const id = parseInt(category.value.id, 10);
          if (id > maxId) {
            maxId = id;
          }
          traverse(category.children);
        });
      }
      traverse(categories);
      return maxId;
    }
  
    function buildCategoryTree(categories, level) {
      if (!categories || categories.length === 0) {
        return '<p>No hay categorías disponibles</p>';
      }
  
      let treeHtml = `<ul class="list-group">`;
      categories.forEach(function(category) {
        treeHtml += `<li class="list-group-item level-${level}">
          <strong>ID:</strong> ${category.value.id} <strong>Nombre:</strong> ${category.value.name}
          ${buildCategoryTree(category.children, level + 1)}
        </li>`;
      });
      treeHtml += `</ul>`;
      return treeHtml;
    }
  });