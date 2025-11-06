<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");
require "./db.php";

if($_SERVER['REQUEST_METHOD'] === "POST"){
    $data = json_decode(file_get_contents("php://input"), true);

    $task = $data['task'];
    $deadline = $data['deadline'];

    $sql = "INSERT INTO tasks(task, deadline) VALUES('$task', '$deadline')";
    mysqli_query($conn, $sql);
}