<?php
include_once('DB.php');
$nombre= $_REQUEST['doctor'];
$numcolegiado=$_REQUEST['numcolegiado'];
$clinicas=$_REQUEST['clinicas'];
$docOriginal=$_REQUEST['docO'];
$respuesta=DB::modificarDoctor($docOriginal,$nombre,$numcolegiado,$clinicas);
if($respuesta==0){
    $mensaje="Ningun doctor Modificado.";
    $estado=0;
    }
else {
    $estado=1;
    $mensaje="Doctor modificado con exito.";
}

$resultado = array();
$resultado[] = array(
    'mensaje' => $mensaje,
    'estado' => $estado
);

echo json_encode($resultado);

?>
