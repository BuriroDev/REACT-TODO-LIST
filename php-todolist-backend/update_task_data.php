<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");
require "./db.php";

if($_SERVER['REQUEST_METHOD'] === "POST"){
    $data = json_decode(file_get_contents("php://input"), true);

    $id = $data['id'];
    $task = $data['task'];
    $deadline = $data['deadline'];

    $sql = "UPDATE tasks SET task = '$task', deadline = '$deadline' WHERE id = $id";
    mysqli_query($conn, $sql);
}