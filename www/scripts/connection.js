var connection = {};
connection.url = null;

// add listener to connect to R++ software using the given ip address
document.getElementById("connectButton").addEventListener("click", function(){
    connection.url = "http://" + document.getElementById("ipAddress").value + ":4040";
    rpp_connection.getUri(connection.url.substring(0, connection.url.length - 5));
});