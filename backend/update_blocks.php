<?php 
require "vendor/autoload.php";
$db = new mysqli("localhost", "noodluis_DEV_BB", "mW!B6gW&n2=k", "noodluis_border_built");
$res = $db->query("SELECT breakdown_blocks FROM giveaways WHERE id=2");
$row = $res->fetch_assoc();
$blocks = json_decode($row["breakdown_blocks"], true);

foreach($blocks as &$block) {
    if (strpos($block["title"], "EXHAUST") !== false) {
        $block["title_es"] = "RENDIMIENTO Y ESCAPE";
        $block["description_es"] = "EQUIPADO CON UNA TOMA DE AIRE Z1 Y UN ESCAPE COMPLETO CAT-BACK PULIDO REV9 CON TUBO EN Y Y PUNTAS DE 4.5\", OFRECIENDO MEJOR FLUJO DE AIRE, UN TONO MÁS PROFUNDO Y UNA PRESENCIA DE RENDIMIENTO MÁS AGRESIVA.";
    } elseif (strpos($block["title"], "STANCE") !== false) {
        $block["title_es"] = "SUSPENSIÓN Y POSTURA";
        $block["description_es"] = "EQUIPADO CON SUSPENSIÓN BC RACING COILOVERS COMPLETAMENTE AJUSTABLE Y RINES DE ALEACIÓN FORJADA DE 19 PULGADAS CON LLANTAS DE RENDIMIENTO NITTO INVO. PRESENCIA AGRESIVA PERO CONDUCCIÓN SUAVE.";
    } elseif (strpos($block["title"], "INTERIOR") !== false || strpos($block["title"], "RACING") !== false) {
        $block["title_es"] = "INTERIOR DE CARRERAS";
        $block["description_es"] = "CABINA SIMPLIFICADA CON ASIENTOS DE CUBO SPARCO EVO, ARNESES DE SEGURIDAD DE 5 PUNTOS, JAULA ANTIVUELCO HOMOLOGADA Y VOLANTE DE LIBERACIÓN RÁPIDA NARDI.";
    } elseif (strpos($block["title"], "BODY") !== false || strpos($block["title"], "VEILSIDE") !== false || strpos($block["title"], "AERO") !== false) {
         $block["title_es"] = "KIT AERODINÁMICO VEILSIDE";
         $block["description_es"] = "KIT DE CARROCERÍA COMPLETO VEILSIDE V3 QUE INCLUYE FASCIAS DELANTERA Y TRASERA, ESTRIBOS LATERALES Y ALERÓN TRASERO, TERMINADO EN UN LLAMATIVO BLANCO PERLA, DÁNDOLE AL Z UNA POSTURA MÁS BAJA, ANCHA Y AGRESIVA MIENTRAS MANTIENE SU CARÁCTER JDM ICÓNICO.";
    }
}

$json = $db->real_escape_string(json_encode($blocks, JSON_UNESCAPED_UNICODE));
$db->query("UPDATE giveaways SET breakdown_blocks = '$json' WHERE id=2");
echo "Updated successfully.";
?>
