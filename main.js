var outputX = document.querySelector('.outputRealTimeX');
var outputY = document.querySelector('.outputRealTimeY');
var outputDataX = document.querySelector('.dataXDisp')
var outputDataY = document.querySelector('.dataYDisp');
var outputTime = document.querySelector('.dataTimeDisp');
var outputRecord = document.querySelector('.recordDisp');

var dataSetLength = 40;
var d = new Date().getTime();
var remoteX;
var remoteY;
var dataX = [];
var dataY = [];
var time = [];
var plotMaxX = [];
var plotMinX = [];
var plotMaxY = [];
var plotMinY = [];
var maxX;
var minX;
var maxY;
var minY;

//Plot variables

var trace1 = {
		x: time,  
		y: dataX,
		mode: 'lines+markers',
		type: 'scatter',
		marker: { size: 1 },
		name: 'Beta',
		connectgaps: false,
		line: {
    		color: 'rgb(55, 128, 180)',
    		width: 2
  		},
  		hoverinfo: 'none'
};

 var trace2 = {
		x: time,  
		y: plotMaxX,
		mode: 'lines',
		type: 'scatter',
		name: 'Beta max',
		line: {
    		color: 'rgb(55, 128, 220)',
    		width: 1,
    		dash: 'dot'
  		},
  		showlegend: false,
  		hoverinfo: 'none'
};

var trace3 = {
		x: time,  
		y: plotMinX,
		mode: 'lines',
		type: 'scatter',
		name: 'Beta min',
		line: {
    		color: 'rgb(23, 106, 180)',
    		width: 1,
    		dash: 'dot'
  		},
  		showlegend: false,
  		hoverinfo: 'none'
};

var trace4 = {
		x: time,  
		y: dataY,
		mode: 'lines+markers',
		type: 'scatter',
		marker: { size: 1 },
		name: 'Gamma',
		width: 3,
		connectgaps: false,
		line: {
    		color: 'rgb(255, 175, 26)',
    		width: 2
  		},
  		hoverinfo: 'none'
};

var trace5 = {
		x: time,  
		y: plotMaxY,
		mode: 'lines',
		type: 'scatter',
		name: 'Gamma max',
		line: {
    		color: 'rgb(255, 166, 0)',
    		width: 1,
    		dash: 'dot'
  		},
  		showlegend: false,
  		hoverinfo: 'none'
};

var trace6 = {
		x: time,  
		y: plotMinY,
		mode: 'lines',
		type: 'scatter',
		name: 'Gama min',
		line: {
    		color: 'rgb(221, 152, 22)',
    		width: 1,
    		dash: 'dot'
  		},
  		showlegend: false,
  		hoverinfo: 'none'
};

 var trace7 = {
  		x: [2],
 		y: [2],
 		text: ['System paused'],
		mode: 'text',
  		showlegend: false,
  		hoverinfo: 'none'
};

var data = [trace1, trace2, trace3, trace4, trace5, trace6];
var pause = [trace7];

var layout = {
  font: {
	family :'"Helvetica Neue",Helvetica,Arial,sans-serif',
	size: 12,
	color: '#7f7f7f',
  },
  autosize: true,
  margin: {
    l: 50,
    r: 25,
    b: 100,
    t: 50,
    pad: 2
  },
  showlegend: true,
  legend: {"orientation": "h"},
}

Plotly.newPlot('plotDiv', pause, layout, {displayModeBar: false});
outputX.innerHTML = "Beta : " + "<br>";
outputX.innerHTML += "max: " + "<br>";
outputX.innerHTML += "min: ";
outputY.innerHTML = "Gamma: " + "<br>";
outputY.innerHTML += "max: " + "<br>";
outputY.innerHTML += "min: ";


//Setup Functions
var e = 1;
function setdevice(device)
{
	e= device;
}

//Generate random tracking Pin (only once)
var setion;
var executed = false;
function makePin()
{
    if (!executed && e == 1) {
        executed = true;

		var pin="";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

	    for( var i=0; i < 5; i++ )
	       pin += possible.charAt(Math.floor(Math.random() * possible.length));
	   	document.getElementById("dispPin").innerHTML = pin;
	   	setion = String(pin);

		firebase.database().ref().child(pin).set("Root"); //Set real-time database for new Pin
		firebase.database().ref(pin).child('valueX').set(0);
		firebase.database().ref(pin).child('valueY').set(0);

	}
}


// On-board data update
var x =0;
var y =0;
function handleOrientation(event) {
	x = event.beta;  // In degree in the range [-180,180]
	y = event.gamma; // In degree in the range [-90,90]
	// To make computation easier we shift the range of x and y to [0,180]
	x += 90;
	y += 90;
	x = parseInt(x);
	y = parseInt(y);
}
window.addEventListener('deviceorientation', handleOrientation);




//Input tracking Pin
var pinTrack ="";
function setPin() {
    pinTrack = (document.getElementById("inputTrackPin").value).toUpperCase();
}

//Bind keyboard Enter to submit tracking Pin
document.getElementById("inputTrackPin")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        document.getElementById("runStopButton").click();
    }
}); 



//Sunrise Functions
var runStop= 0;
function stop()
{
	if (runStop == 0) {
		outputRecord.innerHTML = '&#11044;';
		d = new Date().getTime();
		dataX.length = 0; //clear dataX array
		dataY.length = 0; //clear dataY array
		time.length = 0; //clear time array
		document.getElementById('toggleTab1').style.pointerEvents = 'none';
		document.getElementById('toggleTab2').style.pointerEvents = 'none';
		runStop = 1;
		return;
	}
	if (runStop == 1) {
		dataX.length = 0; //clear dataX array
		dataY.length = 0; //clear dataY array
		time.length = 0; //clear time array
		outputRecord.innerHTML = '';
		logDataCheck.checked = false;
		document.getElementById('toggleTab1').style.pointerEvents = 'auto';
		document.getElementById('toggleTab2').style.pointerEvents = 'auto';
		if (setion != null){
			firebase.database().ref(setion).child('valueX').set(0);
			firebase.database().ref(setion).child('valueY').set(0);

		}
		runStop = 0;
		return;
	}
}

function setLogData() {
	logData = document.getElementById("logDataCheck").checked;
}

function setReset() {
	outputTime.innerHTML = "";
	outputDataX.innerHTML = ""; 
	outputDataY.innerHTML = "";
}

function run(){

	//Broadcast
	if (e==1) {
	 function dataRequestLoop(i) {
	    if (i < 1){
	    	i = (dataSetLength-(dataSetLength-1));
	    	dataX.shift();
	    	dataY.shift();
	    	time.shift();
	    }
	    setTimeout(function () {
	        now = new Date().getTime();
			dataX[dataSetLength-i] = x;
			dataY[dataSetLength-i] = y;

			//On-board data update
			firebase.database().ref().child(setion).update({"valueX": x});
			firebase.database().ref().child(setion).update({"valueY": y});

			maxX = Math.max.apply(null, dataX.filter(function(n) { return !isNaN(n); })); //filters out NaN values from array
			minX = Math.min.apply(null, dataX.filter(function(n) { return !isNaN(n); })); //filters out NaN values from array
			maxY = Math.max.apply(null, dataY.filter(function(n) { return !isNaN(n); })); //filters out NaN values from array
			minY = Math.min.apply(null, dataY.filter(function(n) { return !isNaN(n); })); //filters out NaN values from array
			time[dataSetLength-i] = (now-d) / 1000;

			outputX.innerHTML = "Beta : " + parseInt(x).toPrecision(3) + "\n" + "<br>";
	    	outputX.innerHTML += "max: " + maxX.toPrecision(3) + "\n" + "<br>";
	    	outputX.innerHTML += "min: " + minX.toPrecision(3) + "\n";
			outputY.innerHTML = "Gamma: " + parseInt(y).toPrecision(3) + "\n" + "<br>";
			outputY.innerHTML += "max: " + maxY.toPrecision(3) + "\n" + "<br>";
	    	outputY.innerHTML += "min: " + minY.toPrecision(3) + "\n";
	    	for (var t = 0; t < time.length; t++) {
    			plotMaxX[t] = maxX;
    			plotMinX[t] = minX;
    			plotMaxY[t] = maxY;
    			plotMinY[t] = minY;
    		}
			Plotly.newPlot('plotDiv', data, layout);
			if (logData) {
		    	outputTime.innerHTML += parseInt(time[dataSetLength-i]).toPrecision(3) + "," + "<br>";
		    	outputDataX.innerHTML += parseInt(dataX[dataSetLength-i]).toPrecision(3) + "," + "<br>";
				outputDataY.innerHTML += parseInt(dataY[dataSetLength-i]).toPrecision(3) + "<br>";
	    	}

			if (runStop==0) {
				outputX.innerHTML = "Beta : " + "<br>";
				outputX.innerHTML += "max: " + "<br>";
				outputX.innerHTML += "min: ";
				outputY.innerHTML = "Gamma: " + "<br>";
				outputY.innerHTML += "max: " + "<br>";
				outputY.innerHTML += "min: ";
				Plotly.newPlot('plotDiv', pause, layout, {displayModeBar: false}); 
				return;
			} //breaks infinite loop
	        dataRequestLoop(--i);
	    }, 10);
	 }
	 dataRequestLoop(dataSetLength);
	}

	//Remote
	if (e==2) {
	 function dataRequestLoop(i) {
	    if (i < 1){
	    	i = (dataSetLength-(dataSetLength-1));
	    	dataX.shift();
	    	dataY.shift();
	    	time.shift();
	    }
	    setTimeout(function () {
	        now = new Date().getTime();

			//Remote data request
			server = firebase.database().ref().child(pinTrack);//Set real-time database for new Pin
			server.on('value',snap => {
				remoteX = snap.val().valueX;
				remoteY = snap.val().valueY; 
			});

			dataX[dataSetLength-i] = parseInt(remoteX);
			dataY[dataSetLength-i] = parseInt(remoteY);

			maxX = Math.max.apply(null, dataX);
			minX = Math.min.apply(null, dataX);
			maxY = Math.max.apply(null, dataY);
			minY = Math.min.apply(null, dataY);
			time[dataSetLength-i] = (now-d) / 1000;
			outputX.innerHTML = "Beta : " + parseInt(remoteX).toPrecision(3) + "\n" + "<br>";
	    	outputX.innerHTML += "max: " + maxX.toPrecision(3) + "\n" + "<br>";
	    	outputX.innerHTML += "min: " + minX.toPrecision(3) + "\n";
			outputY.innerHTML = "Gamma: " + parseInt(remoteY).toPrecision(3) + "\n" + "<br>";
			outputY.innerHTML += "max: " + maxY.toPrecision(3) + "\n" + "<br>";
	    	outputY.innerHTML += "min: " + minY.toPrecision(3) + "\n";
    		for (var t = 0; t < time.length; t++) {
    			plotMaxX[t] = maxX;
    			plotMinX[t] = minX;
    			plotMaxY[t] = maxY;
    			plotMinY[t] = minY;
    		}
			Plotly.newPlot('plotDiv', data, layout);
			if (logData) {
		    	outputTime.innerHTML += parseInt(time[dataSetLength-i]).toPrecision(3) + "," + "<br>";
		    	outputDataX.innerHTML += parseInt(dataX[dataSetLength-i]).toPrecision(3) + "," + "<br>";
				outputDataY.innerHTML += parseInt(dataY[dataSetLength-i]).toPrecision(3) + "," + "<br>";
	    	}
			if (runStop==0) {
				outputX.innerHTML = "Beta : " + "<br>";
				outputX.innerHTML += "max: " + "<br>";
				outputX.innerHTML += "min: ";
				outputY.innerHTML = "Gamma: " + "<br>";
				outputY.innerHTML += "max: " + "<br>";
				outputY.innerHTML += "min: ";
				Plotly.newPlot('plotDiv', pause, layout, {displayModeBar: false}); 
				return;
			} //breaks infinite loop
	        dataRequestLoop(--i);
	    }, 10);
	 }
	 dataRequestLoop(dataSetLength);
	}
}