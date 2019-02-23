var activityList = {
	activities: [],
	addActivity: function(activity, timeCompletion) {
		this.activities.push({
			activity: activity,
			timeCompletion: timeCompletion
		})
	},
	deleteActivity: function(position) {
		this.activities.splice(position, 1)
	}
}

var handlers = {
	// Then add handlers to the input
	addActivity: function() {
		var activityInput = document.getElementById('activity-input');
		// var activityTime = document.getElementById('activityTime-input');
		var activityTime = document.getElementById('timer');


		activityList.addActivity(activityInput.value, activityTime.textContent);
		activityInput.value = '';
		// activityTime.value = '';
		activityTime.textContent = '00:00:00';

		view.displayActivities();
	},
	deleteActivity: function(position) {
		activityList.deleteActivity(position);
		view.displayActivities();
	}
}

var view = {
	displayActivities: function() {
		var activitiesUl = document.querySelector('ul');
		activitiesUl.innerHTML = '';

		// For each activity, create an li element and add the activity to it
		activityList.activities.forEach(function(element, position) {
			var activityLi = document.createElement('li');
			var activityTimeLi = document.createElement('li');
			var activities = activityList.activities;

			activityLi.id = position;
			activityLi.className = 'activityName';
			activityTimeLi.id = position;
			activityTimeLi.className = 'activityTime';

			activityLi.textContent = 'Activity: ' + element.activity;
			activityTimeLi.textContent = ' Time: ' + element.timeCompletion;

			activityTimeLi.appendChild(this.createDeleteButton());
			activitiesUl.appendChild(activityLi);
			activitiesUl.appendChild(activityTimeLi);
			reset();
		}, this)
	},
	createDeleteButton: function() {
		// Want to create the delete button here
		var deleteButton = document.createElement('button');
		deleteButton.className = 'deleteActivity';
		deleteButton.textContent = 'Delete';
		return deleteButton;
	}
}

// Setup event listeners here so when delete button is clicked, handlers.deleteActivity runs
var setupEventListeners = {
	deleteButton: function() {
		var activitiesUl = document.querySelector('ul');

		activitiesUl.addEventListener('click', function(event) {
			// Get the position of what's clicked

			if (event.target.className === 'deleteActivity') {
				var position = event.target.closest('li').id;
				handlers.deleteActivity(position);
			}
		})
	}
}

setupEventListeners.deleteButton();

// Stopwatch
var T = (function () { 
    'use strict';

    var timeElapsed  = 0, 
        timeStarted = 0,
        splitCount = 0,
        update;

    return {
        timeStarted: timeStarted,
        timeElapsed: timeElapsed,
        splitCount: splitCount,
        update: update
    };
}());


// Start timer or continue from paused time
function startTimer() {

	// If the timer has been paused, the time already elapsed is subtracted
	// from the time NOW so that the elapsed time is maintained when the
	// timer restarts
	T.timeStarted = new Date().getTime() - T.timeElapsed; 

	// Need setInterval as a variable so it can be cleared on stop/reset
	update = setInterval(postTime, 10);

	//Disable/enable appropriate buttons	
	document.getElementById("reset").disabled = false;	
	// startButtons();
	
	return update;
}



//Freeze the timer
function stopTimer(){
	
	// Stop the interval updating
	clearInterval(update);

	//Disable/enable appropriate buttons
	// stopButtons();
}



// Record split without stopping timer. Will add lap time at some point
function split(){
	T.splitCount++;
	document.getElementById("splits").innerHTML += "</br>Split " + T.splitCount + ": " + render(T.timeElapsed);

}


//Reset the timer to zero and clear splits
function reset(){
	clearInterval(update);
	T.timeStarted = 0;
	T.timeElapsed = 0;
	T.splitCount = 0;
	document.getElementById("timer").innerHTML = "00:00:00";
	// document.getElementById("reset").disabled = true;	

	// stopButtons()

	// document.getElementById("splits").innerHTML = "<br>Splits</br>"
}



// Disable start button, enable stop and split
function startButtons(){
	document.getElementById("start").disabled = true;
	document.getElementById("stop").disabled = false;
	document.getElementById("split").disabled = false;

}

// Enable start button, disable stop and split
function stopButtons(){
	document.getElementById("start").disabled = false;
	document.getElementById("stop").disabled = true;
	document.getElementById("split").disabled = true;

}

// Convert time to mm/ss/cc
function render(){
	T.timeElapsed = new Date().getTime() - T.timeStarted;

	var toRender = T.timeElapsed;

    var mins = Math.floor(toRender/60000);
    toRender -= mins * 60000;
    var secs = Math.floor(toRender/1000);
    toRender -= secs * 1000;
    var cent = Math.round(toRender/10);

	return addLeadingZero(mins) + ":" + addLeadingZero(secs) + ":" + addLeadingZero(cent); 
}

//helper function to make render neater
function addLeadingZero (n) {
    if(n <= 9) {
    	return '0'+ n; 
    	} else {
        return '' + n; 
    }
} 

// Post the time in the timer div
function postTime(time) {
	document.getElementById("timer").innerHTML = render(time);

}