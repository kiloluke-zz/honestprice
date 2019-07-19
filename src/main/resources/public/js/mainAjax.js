var totalPrice = 0;
var table = $('#tableID');
var webSocket;
var inputArray;

id("submitBtn").addEventListener("click", function () {
    clearBox('tbody');
    //Establish the WebSocket connection and set up event handlers
    webSocket = new WebSocket("ws://" + location.hostname + ":" + location.port + "/main");



    webSocket.onmessage = function (msg) {
        updateTable(msg);
    };

    webSocket.onerror = function (error) {
        alert("Error  " + error.message);
    };

    webSocket.onopen = function () {
        var input = $('#maintext').val();
        input = input.replace(/[^a-z0-9\s]|\t+/gi, " ");
        inputArray = input.split(/\n+/g);
        $('#loading-gif').show();

        var style1 = "style=\"text-align:center;vertical-align:middle;background-color: #ffb500; color: white;\"";
        table.append('<tbody><tr>' +
            '<td ' + style1 + '>Part</td><td ' + style1 + '>Name</td><td ' + style1 + '>Price</td></tr></tbody>');
        sendMessage(JSON.stringify(inputArray));
    };

    webSocket.onclose = function () {
        $('#loading-gif').hide();
        totalPrice = totalPrice * 100;
        totalPrice = Math.round(totalPrice);
        totalPrice = totalPrice / 100;
        table.append('<tbody><tr><td style="background-color: #5868ff;color: #f5f5f5"></td>' +
            '<td style="background-color: #5868ff;color: #f5f5f5">Total</td>' +
            '<td style="background-color: #5868ff;color: #f5f5f5">$' + totalPrice + '</td></tr></tbody>');


        var priceProvidedByUserString = $('#salePrice').val();

        if (priceProvidedByUserString.length > 0) {


            var salePrice = parseFloat(priceProvidedByUserString);
            var grade = totalPrice / salePrice;
            var gradeAF;
            var gradeBackgroundColor;
            if (grade < 0.1) {
                gradeBackgroundColor = '#FF0700';
                gradeAF = 'F'
            } else if (grade < 0.2) {
                gradeBackgroundColor = 'FF5500';
                gradeAF = 'E-'
            } else if (grade < 0.3) {
                gradeBackgroundColor = '#ff8d00';
                gradeAF = 'E'
            } else if (grade < 0.4) {
                gradeBackgroundColor = '#ffc500';
                gradeAF = 'D'
            } else if (grade < 0.5) {
                gradeBackgroundColor = '#aaae00';
                gradeAF = 'C-';
            } else if (grade < 0.6) {
                gradeBackgroundColor = '#5aae00';
                gradeAF = 'C'
            } else if (grade < 0.7) {
                gradeBackgroundColor = '#41ae00';
                gradeAF = 'B-'
            } else if (grade < 0.8) {
                gradeBackgroundColor = '#00ae06';
                gradeAF = 'B';
            } else if (grade < 0.9) {
                gradeBackgroundColor = '00CA06';
                gradeAF = 'A';
            } else if (grade > 0.9) {
                gradeBackgroundColor = '#00e90e';
                gradeAF = 'A+';
            }


            table.append('<tbody><tr><td style="background-color: ' + gradeBackgroundColor + ';color: white"></td>' +
                '<td style="background-color: ' + gradeBackgroundColor + ';color: white">Bike Price Estimator grade</td>' +
                '<td style="background-color: ' + gradeBackgroundColor + ';color: white">' + gradeAF + '</td></tr></tbody>');
        }


    };

    //Send message if "Send" is clicked




});

//Send message if enter is pressed in the input field
id("maintext").addEventListener("keypress", function (e) {
    if (e.keyCode === 13) {
        sendMessage(JSON.stringify(inputArray));
        inputArray.length = 0;
    }
});

//Send a message if it's not empty, then clear the input field
function sendMessage(message) {
    if (message !== "") {
        webSocket.send(JSON.stringify(message));
    }
}

//Update the chat-panel, and the list of connected users
function updateTable(msg) {
    table.show();
    var data = JSON.parse(msg.data);
    console.log(data.info);
    $('#tbody').append(data.info);
    window.scrollTo(0,document.body.scrollHeight);
}

//Helper function for inserting HTML as the first child of an element
function insert(targetId, message) {
    id(targetId).insertRow(-1);
}

//Helper function for selecting element by id
function id(id) {
    return document.getElementById(id);
}
