<?php
$url = "https://www.scientific.net/Paper/GetDownloadsAndVisitorsCount?paperId=523460";
$scientificNetCounter = file_get_contents($url);

echo $scientificNetCounter." reads on A.E.F. website" 
?>