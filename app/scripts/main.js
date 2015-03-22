'use strict';
$(document).ready(function() {

    function listar(datos){
        console.log(datos);

        var salida=datos.replace(/,/g,'</li><li>');
        return salida;
    }


    $('#mitabla').dataTable( {

    'processing': true,
           'serverSide': true,
           'ajax': 'php/cargar_datos.php',
           'language': {
               'sProcessing': 'Procesando...',
               'sLengthMenu': 'Mostrar _MENU_ registros',
               'sZeroRecords': 'No se encontraron resultados',
               'sEmptyTable': 'Ningún dato disponible en esta tabla',
               'sInfo': 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
               'sInfoEmpty': 'Mostrando registros del 0 al 0 de un total de 0 registros',
               'sInfoFiltered': '(filtrado de un total de _MAX_ registros)',
               'sInfoPostFix': '',
               'sSearch': 'Buscar:',
               'sUrl': '',
               'sInfoThousands': ',',
               'sLoadingRecords': 'Cargando...',
               'oPaginate': {
                   'sFirst': 'Primero',
                   'sLast': 'Último',
                   'sNext': 'Siguiente',
                   'sPrevious': 'Anterior'
               },
               'oAria': {
                   'sSortAscending': ': Activar para ordenar la columna de manera ascendente',
                   'sSortDescending': ': Activar para ordenar la columna de manera descendente'
               }
           },
          'columns': [{
              'data':'nombre_doctor',
               'render': function(data) {
              return '<a class="enlaces" href="#">'+data+'</a>'
                }

           }, {
               'data': 'numcolegiado'
           }, {
               'data': 'clinicas',
               'render': function(data) {
                   var linea=listar(data);
               return '<ul><li>' + linea + '</li></ul>';
                }
           }, {
                'render': function(data) {
                   return '<a class="btn btn-primary editarbtn" href="#">Editar</a>'
                }
           }, {
               'render': function(data) {
                   return '<a class="btn btn-warning borrarbtn" href="#">Borrar</a>'
                }
           }]
    });






              /* 'data': 'nombre_doctor',
               /*añadimos las clases editarbtn y borrarbtn para procesar los eventos click de los botones. No lo hacemos mediante id ya que habrá más de un
               botón de edición o borrado
               'render': function(data) {
                   return '<a class="btn btn-primary editarbtn" href=http://localhost/php/editar.php?id_clinica=' + data + '>Editar</a><a class="btn btn-warning borrarbtn" href=http://localhost/php/borrar.php?id_clinica=' + data + '>Borrar</a>';
               }
           }]
       });


    */




















} );
