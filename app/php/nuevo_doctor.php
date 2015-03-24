<?php
include_once('DB.php');
$nombre= $_REQUEST['doctor'];
$numcolegiado=$_REQUEST['numcolegiado'];
$clinicas=$_REQUEST['clinicas'];
$respuesta=DB::nuevoDoctor($nombre,$numcolegiado,$clinicas);
if($respuesta==0){
    $mensaje="Ningun doctor Añadido.";
    $estado=0;
    }
else {
    $estado=1;
    $mensaje="Doctor añadido con exito.";
}

$resultado = array();
$resultado[] = array(
    'mensaje' => $mensaje,
    'estado' => $estado
);

echo json_encode($resultado);

?>
