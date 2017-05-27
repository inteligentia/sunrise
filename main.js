var outputX = document.querySelector('.outputRealTimeX');
var outputY = document.querySelector('.outputRealTimeY');
var outputDataX = document.querySelector('.dataXDisp')
var outputDataY = document.querySelector('.dataYDisp');
var outputTime = document.querySelector('.dataTimeDisp');
var outputRecord = document.querySelector('.recordDisp');

var dataSetLength = 40;
var d = new Date().getTime();
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
const xServer = firebase.database().ref().child('Mob'); //Set real-time database



// On-board
var x;
var y;
function handleOrientation(event) {
  x = event.beta;  // In degree in the range [-180,180]
  y = event.gamma; // In degree in the range [-90,90]
  // To make computation easier we shift the range of x and y to [0,180]
  x += 90;
  y += 90;

  if(e==1 && runStop==1){
	  xServer.update({
		valueX: x
	  });
	  xServer.update({
		valueY: y
	  });
  }
}
window.addEventListener('deviceorientation', handleOrientation);

//Remote
var Remote;
var remoteX;
var remoteY;
xServer.on('value',snap => {
	remote = snap.val();
	remoteX = snap.val().valueX;
	remoteY = snap.val().valueY;
});



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
  		}
};

var trace2 = {
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
  		}
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
  		}
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
  		}
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
  		}
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
  		}
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
  		}
};

 var trace7 = {
  		x: [2],
 		y: [2],
 		text: ['System paused, select a source device and click the Run/Stop button'],
		mode: 'text'
};

var data = [trace1, trace2, trace3, trace4, trace5, trace6];
var pause = [trace7];

var layout = {
  font: {
	family :'"Helvetica Neue",Helvetica,Arial,sans-serif',
	size: 12,
	color: '#7f7f7f',
  },
  xaxis: {
    title: 'Time (seconds)',
  },
  margin: {
    l: 50,
    r: 50,
    b: 75,
    t: 50,
    pad: 2
  },
}

Plotly.newPlot('plotDiv', pause, layout);
outputX.innerHTML = "Beta : " + "<br>";
outputX.innerHTML += "max: " + "<br>";
outputX.innerHTML += "min: ";
outputY.innerHTML = "Gamma: " + "<br>";
outputY.innerHTML += "max: " + "<br>";
outputY.innerHTML += "min: ";




//Sunrise Functions

var e = 1;
function setdevice(device)
{
	e= device;
}

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

	//On-Board
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
			dataX[dataSetLength-i] = parseInt(x);
			dataY[dataSetLength-i] = parseInt(y);
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
				Plotly.newPlot('plotDiv', pause, layout); 
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
			outputY.innerHTML = "Gamma: " + parseInt(remoteX).toPrecision(3) + "\n" + "<br>";
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
				Plotly.newPlot('plotDiv', pause, layout); 
				return;
			} //breaks infinite loop
	        dataRequestLoop(--i);
	    }, 10);
	 }
	 dataRequestLoop(dataSetLength);
	}
}