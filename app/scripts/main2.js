   'use strict';

   $(document).ready(function () {
       function listar(datos) {
           var salida = datos.replace(/,/g, '</li><li>');
           return salida;
       }

       var miTabla = $('#mitabla').DataTable({
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
               'data': 'nombre_doctor',
               'render': function (data) {
                   return '<a href="#" data-toggle="modal" data-target="#modalEditar" class="editarbtn"  >' + data + '</a>'
               }

           }, {
               'data': 'numcolegiado'
           }, {
               'data': 'clinicas',
               'render': function (data) {
                   var linea = listar(data);
                   return '<ul><li>' + linea + '</li></ul>';
               }
           }, {
               'data': 'nombre_doctor',
               'render': function (data) {
                   return '<button type="button" class="btn btn-primary editarbtn" data-toggle="modal" data-target="#modalEditar">Editar</button>'
               }
           }, {
               'data': 'nombre_doctor',
               'render': function (data) {
                   return '<button type="button"  class="btn btn-danger borrarbtn" data-toggle="modal" data-target="#modalBorrar">Borrar</button>';
               }
           }]
       }); // Fin de Datatables

       $('#mitabla').on('click', '.borrarbtn', function (e) {
           e.preventDefault();
           var nRow = $(this).parents('tr')[0];
           var aData = miTabla.row(nRow).data();
           var doctor = aData.nombre_doctor;
           $('#borrarDoctor').click(function () {
               $('#modalBorrar').modal('hide');
               var promesa = $.ajax({
                   data: {
                       doctor: doctor
                   },
                   type: "POST",
                   url: "php/borrar_doctor.php",
               });
               promesa.done(function (data, textStatus, jqXHR) {
                   if (data['estado'] == 0) {
                       $.growl.error({
                           message: data['mensaje']
                       });
                       miTabla.draw();
                   } else {
                       $.growl.notice({
                           message: data['mensaje']
                       });
                       miTabla.draw();
                   }
               });
               promesa.fail(function (jqXHR, textStatus, errorThrown) {
                   $.growl.error({
                       message: "Fallo en la consulta."
                   });
               });
           });
       });





   });
