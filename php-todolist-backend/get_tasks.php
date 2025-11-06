<?php 
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require "./db.php";

$sql = "SELECT * FROM tasks WHERE status = 'Pending'";
$result = mysqli_query($conn, $sql);

$users = [];

while($row = $result->fetch_assoc()){
    $users[] = $row;
}

echo json_encode($users);




