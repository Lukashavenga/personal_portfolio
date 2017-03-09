<?php
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "seriesData";
$method = $_POST["method"];
$sql = null;

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

switch($method){
    case "getSeries":
        $sql = "SELECT Name, Season, Episode FROM series";
        break;
    case "saveData":
        $sql = "INSERT INTO series VALUES (".data['name'].", ".data['season'].", ".data['episode'].")";
        break;
}

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        print '{"Name": "'.$row["Name"].'", "Season": "'.$row["Season"].'", "Episode": "'.$row["Episode"].'"}';
    }
} else {
    print "0 results";
}
$conn->close();
?>


