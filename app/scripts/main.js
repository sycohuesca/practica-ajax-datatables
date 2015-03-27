   'use strict';

// Empieza antes de cargar el documento.
   $(document).ready(function () {
var miTabla;
var docOriginal;
var validaciones=$('#formulario').validate({
    rules:{
        nombre:{
            required:true,
            lettersonly:true
        },
        numcolegiado:{
            required:true,
            digits:true
        },
        clinicas:{
           required:true,
           minlength:"2"
        }
    }
});
  // Metodo que valida los datos.
   function validarDatos(opciones) {
         $('#formulario').show();
        $('#modalFormulario').modal('hide');
       var doctor = $('#nombre').val();
       var numcolegiado = $('#numcolegiado').val();
       var clinicas = $('#clinicas').val();
       // validar datos
       if (opciones == "nuevo") {
           var php = "php/nuevo_doctor.php";
       } else {
           var php = "php/modificar_doctor.php";
       }
       var promesa = $.ajax({
           data: {
               docO:docOriginal,
               doctor: doctor,
               numcolegiado: numcolegiado,
               clinicas: clinicas
           },
           dataType: 'json',
           type: "POST",
           url: php,
      });
       mensajes(promesa);
 };  // Fin de validarDatos

 // Metodo que pone en formato una lista.
 function listar(datos) {
           var salida = datos.replace(/,/g, '</li><li>');
           return salida;
       }  // Fin del metodo listar.
// Metodo que saca los mensajes tipo growl
   function mensajes(promesa) {
       promesa.done(function (data) {
           var men = data[0]['mensaje'];
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
                   message: men
               });
               miTabla.draw();
           }
       });
       promesa.fail(function (jqXHR, textStatus, errorThrown) {
           $.growl.error({
               message: "Fallo en la consulta."
           });
       });
   };   //Fin metodo mensajes.

 $.validator.addMethod("lettersonly", function(value, element) {
    	return this.optional(element) || /^[a-z ñáéíóú]+$/i.test(value);
		}, "Introduce solo letras.");
$.extend($.validator.messages, {
	required: "Este campo es obligatorio.",
	digits: "Por favor, escribe sólo dígitos.",
	minlength: $.validator.format("Por favor, no escribas menos de {0} caracteres."),

});

       $('#clinicas').load('php/cargar_clinicas.php');
        miTabla = $('#mitabla').DataTable({    // Plugin Datatables
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



// Metodo para asignar el boton de borrado.
       $('#mitabla').on('click', '.borrarbtn', function (e) {
           e.preventDefault();
           $('#panelModificaciones').hide();
            $('#borrar').show();
           $('#titulo').html("Borrar Doctor");

           $('#accion').html(' <input type="submit"  id="botonBorrado" value="Borrar"  class="btn btn-primary">');
           var nRow = $(this).parents('tr')[0];
           var aData = miTabla.row(nRow).data();
           var doctor = aData.nombre_doctor;
           $('#doc').html(doctor);
           $('#botonBorrado').click(function (e) {
               e.preventDefault();
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
       }); // Fin Metodo de borrado.



// Metodo al pulsar el boton nuevo doctor.
       $('#botonNuevo').click(function (e) {
           validaciones.resetForm();
           e.preventDefault();
           $('#titulo').html("Añadir Doctor");
           $('#panelModificaciones').show();
            $('#borrar').hide();
           $('#accion').html('<input type="submit"  id="botonNuevo" value="Guardar"  class="btn btn-primary">');
           $('#nombre').val("");
           $('#numcolegiado').val("");
           $('#clinicas option').removeAttr("selected");

           $('#botonNuevo').click(function (e){
               e.preventDefault();
               if (validaciones.form()){
                 validarDatos("nuevo");
               }

           })


       });   // Fin metodo nuevo doctor
//  Metodo al pulsar editar doctor.
       $('#mitabla').on('click', '.editarbtn', function (e) {
           e.preventDefault();
           validaciones.resetForm();
           $('#panelModificaciones').show();
            $('#borrar').hide();
$('#accion').html('<input type="submit"  id="botonEditar" value="Modificar"  class="btn btn-primary">');

           $('#titulo').html("Editar Doctor");


           var nRow = $(this).parents('tr')[0];
           var aData = miTabla.row(nRow).data();
           docOriginal=aData.nombre_doctor;
           $('#nombre').val(aData.nombre_doctor);
           $('#numcolegiado').val(aData.numcolegiado);
           var clinicasOn = aData.clinicas;
           var clin = clinicasOn.split(',');
           var ck = ('#clinicas');
           $('#clinicas').load('php/cargar_clinicas.php', {
               'clinicas': clin
           });
           $('#botonEditar').click(function(e){
               e.preventDefault();
               if (validaciones.form()){
                 validarDatos('editar');
               }

           })



       });   // Fin metodo editar Doctor.

   });   //  Fin Document Ready.





