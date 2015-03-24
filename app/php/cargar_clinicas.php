<?php
include_once("DB.php" );

$clinicas=DB::cargarClinicas();
if (isset($_REQUEST['clinicas'])){
  $sele=$_REQUEST['clinicas'];
           foreach($clinicas as $key=>$valor){
               if(in_array($valor,$sele)){
                echo '<option selected value="'.$key.'">'.$valor.'</option>';
               }
               else {
                  echo '<option  value="'.$key.'">'.$valor.'</option>';
               }

           }

}
else {

           foreach($clinicas as $key=>$valor){
               echo '<option value="'.$key.'">'.$valor.'</option>';

           }

}


?>
