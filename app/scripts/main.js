   'use strict';

   $(document).ready(function () {
       function listar(datos) {
           var salida = datos.replace(/,/g, '</li><li>');
           return salida;
       }
       $('#clinicas').load('php/cargar_clinicas.php');
       function validarDatos(){
           $('#formulario').validate({


           });

       };

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
                   return '<a href="#" data-toggle="modal" data-target="#modalFormulario" class="editarbtn"  >' + data + '</a>'
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
                   return '<button type="button" class="btn btn-primary editarbtn" data-toggle="modal" data-target="#modalFormulario">Editar</button>'
               }
           }, {
               'data': 'nombre_doctor',
               'render': function (data) {
                   return '<button type="button"  class="btn btn-danger borrarbtn" data-toggle="modal" data-target="#modalFormulario">Borrar</button>';
               }
           }]
       }); // Fin de Datatables

       $('#mitabla').on('click', '.borrarbtn', function (e) {
           $('#formulario').hide();
            $('#titulo').html("Borrar doctor");
            $('#borrar').show();
           $('#accion').html('<button type="button" id="borrarBoton" class="btn btn-primary">Borrar</button>');
               e.preventDefault();
           var nRow = $(this).parents('tr')[0];
           var aData = miTabla.row(nRow).data();
           var doctor = aData.nombre_doctor;
           $('#doc').html(doctor);
           $('#borrarBoton').click(function () {
               $('#modalFormulario').modal('hide');
               var promesa = $.ajax({
                   data: {
                       doctor: doctor
                   },
                   dataType: 'json',
                   type: "POST",
                   url: "php/borrar_doctor.php",
               });
              mensajes(promesa);
           });
       });

$('#botonNuevo').click(function(){
    $('#titulo').html("Añadir doctor");
    $('#nombre').val("");
    $('#numcolegiado').val("");
    $('#clinicas option').removeAttr("selected");
    $('#accion').html('<button type="button" id="nuevoBoton" class="btn btn-primary">Guardar</button>');
     $('#borrar').hide();
    $('#formulario').show();


    $('#nuevoBoton').click(function(){

        validarDatos("nuevo");
    });

});

 $('#mitabla').on('click', '.editarbtn', function (e) {
            $('#formulario').show();
            $('#titulo').html("Editar doctor");
            $('#borrar').hide();
           $('#accion').html('<button type="button" id="editarBoton" class="btn btn-primary">Guardar</button>');
               e.preventDefault();
           var nRow = $(this).parents('tr')[0];
           var aData = miTabla.row(nRow).data();
            $('#nombre').val(aData.nombre_doctor);
            $('#numcolegiado').val(aData.numcolegiado);
     var clinicasOn=aData.clinicas;
     var clin=clinicasOn.split(',');
   var ck=('#clinicas');
     $('#clinicas').load('php/cargar_clinicas.php',{'clinicas':clin});
     var ck=$('#clinicas');
    $.each(ck,function(){

    });




            $('#editarBoton').click(function(){
               validarDatos("editar");
            });



        });
       function validarDatos(opciones){
           $('#formulario').validate({
               rules:{
                   nombre:{},
                   numcolegiado:{},
                   clinicas:{}
               }
           }

           );



        $('#modalFormulario').modal('hide');
        var doctor=$('#nombre').val();
        var numcolegiado=$('#numcolegiado').val();
        var clinicas=$('#clinicas').val();
           // validar datos
        if (opciones=="nuevo"){
           var php="php/nuevo_doctor.php";
        }
           else {
              var php="php/modificar_doctor.php";
           }
          var promesa = $.ajax({
                   data: {
                       doctor: doctor,
                       numcolegiado:numcolegiado,
                       clinicas:clinicas
                   },
                  dataType: 'json',
                   type: "POST",
                   url: php,
               });
            mensajes(promesa);


       };
       function mensajes(promesa){
            promesa.done(function (data) {
                   var men=data[0]['mensaje'];
                   if (data[0]['estado'] == 0) {
                       $.growl({
                           message: men,
                           style: 'error',
                        title: 'Error !!!',
                       });
                       miTabla.draw();
                   } else {
                       $.growl({
                      style: 'notice',
                        title: 'OK !!!',
                        message:  men
                       });
                       miTabla.draw();
                   }
               });
               promesa.fail(function (jqXHR, textStatus, errorThrown) {
                   $.growl.error({
                       message: "Fallo en la consulta."
                   });
               });
       };


   });
