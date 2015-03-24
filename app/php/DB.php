<?php
/**
 * Clase DB
 * S@autor Armando Jimenez Lucea.
 *
 */

class DB {

    protected static function ejecutaConsulta($sql,$valores=null) {
        $opc = array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8");
        $dsn = "mysql:host=localhost;dbname=armandojimenez_i";
        $usuario = 'armandojimenez_i';
        $contrasena = '080280';

        $dwes = new PDO($dsn, $usuario, $contrasena, $opc);
        $resultado = null;
        if ($dwes) {
            $resultado = $dwes->prepare($sql);
            $resultado->execute($valores);
        }

        return $resultado;
    }


    public static function borrarDoctor($doctor) {
        $valores=array(":doctor"=>$doctor);
        $sql='DELETE FROM clinica_doctor WHERE id_doctor =(select id_doctor from doctores where nombre=:doctor); delete from doctores where nombre=:doctor';
        $resultado = self::ejecutaConsulta ($sql,$valores);
          return $resultado->rowCount();
       }
       public static function nuevoDoctor($nombre,$numcolegiado,$clinicas){
            $fila = self::ejecutaConsulta ('SELECT max(id_doctor)as numero FROM doctores')->fetch();
            $id_doctor=$fila['numero']+1;
            $sql="INSERT INTO doctores (id_doctor, nombre, numcolegiado) VALUES (\"$id_doctor\",\"$nombre\", \"$numcolegiado\"); ";
            foreach ($clinicas as $key=>$valor){
                $sql .="INSERT INTO clinica_doctor (id_doctor,id_clinica,numdoctor) VALUES (\"$id_doctor\",\"$valor\",null); ";
            }
            $resultado = self::ejecutaConsulta ($sql);
            return $resultado->rowCount();

       }
       public static function modificarDoctor($nombre,$numcolegiado,$clinicas){
          $salida=1;
         $r1=self::borrarDoctor($nombre);
         $r2=self::nuevoDoctor($nombre, $numcolegiado, $clinicas);
         if ($r1==0 || $r2==0){
             $salida=0;
         }
         return $salida;
       }

public static function cargarClinicas (){
    $sql=" select id_clinica, nombre from clinicas";
     $resultado = self::ejecutaConsulta ($sql);
    $salida=array();
    while($fila=$resultado->fetch()){
        $indice=$fila["id_clinica"];
        $salida[$indice]=$fila["nombre"];
    }
    return $salida;

}


}


?>
