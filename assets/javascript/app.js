$(document).ready(function () {

    var config = {
        apiKey: "AIzaSyBavXyE-u1CzGITbmaau3nXyAIZwstYeKE",
        authDomain: "trainsche.firebaseapp.com",
        databaseURL: "https://trainsche.firebaseio.com",
        projectId: "trainsche",
        storageBucket: "trainsche.appspot.com",
        messagingSenderId: "829789671319"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    var currentTime = moment(); 

    // sets current time and displays a clock
    function currTime() {
        current = moment().format("LT");
        $("#curT").html(current);
        setTimeout(currTime, 1000);
    }
    currTime();

    // takes in info from form
    $("#submit").on("click", function () {

        // don't refresh
        event.preventDefault();

        // retrieve form info
        var tName = $("#name-input").val().trim();
        var tDest = $("#place-input").val().trim();
        var tStart = $("#time-input").val().trim();
        var tFreq = $("#frequency-input").val().trim();


        database.ref().push({
            tName: tName,
            tDest: tDest,
            tStart: tStart,
            tFreq: tFreq
        });

        console.log(tName + " " + tDest + " " + tStart + " " + tFreq);

        $("#form").trigger("reset");
    })



    // pull data from firebase and format it properly
    database.ref().on("child_added", function (snapshot) {

        var trainStart = moment(snapshot.val().tStart, 'HH:mm');
        // change tStart to standard time and makes sure it's before current time
        var firstTrainConv = moment(trainStart,'hh:mm a').subtract(1, "years");

        // diff between current time and first train
        var difference = currentTime.diff(moment(firstTrainConv), "minutes");

        // figure out how many min till next train
        var remainder = difference % snapshot.val().tFreq;
        var minAway = snapshot.val().tFreq - remainder;

        var nextTrain = moment().add(minAway, "minutes").format("hh:mm a");

        var newRow = $(`<tr>`).append(
            $("<td>").text(snapshot.val().tName),
            $("<td>").text(snapshot.val().tDest),
            $("<td>").text(snapshot.val().tFreq),
            $("<td>").text(nextTrain),
            $("<td>").text(minAway),
        );

        $("#trainTableBody").append(newRow);
    });

    // end of script
});