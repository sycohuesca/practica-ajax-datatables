<?php

/* Database connection information */
include("DB.php" );


$nombre=$_REQUEST["doctor"];
$respuesta=DB::borrarDoctor($nombre);
if($respuesta==0){
    $mensaje="Ningun doctor borrado.";
    $estado=0;
    }
else {
    $estado=1;
    $mensaje="Doctor Borrado con exito.";
}

$resultado = array();
$resultado[] = array(
    'mensaje' => $mensaje,
    'estado' => $estado
);
echo json_encode($resultado);
?>
