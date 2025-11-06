<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");
require "./db.php";

if($_SERVER['REQUEST_METHOD'] === "POST"){
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data["c_id"];

    $sql = "UPDATE tasks SET status = 'Completed' WHERE id = $id";
    mysqli_query($conn, $sql);
}
