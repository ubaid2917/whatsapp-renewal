/*
Template Name: Droplet - Responsive Bootstrap 5 Admin Template
Version: 1.1.0
Author: Sean Ngu
Website: http://www.seantheme.com/droplet/
*/

var handleRenderFullcalendar = function() {
	var Calendar = FullCalendar.Calendar;
  var Draggable = FullCalendar.Interaction.Draggable;
	
	// external events
	var containerEl = document.getElementById('external-events');
	new Draggable(containerEl, {
    itemSelector: '.fc-event-link',
    eventData: function(eventEl) {
      return {
        title: eventEl.innerText,
        color: eventEl.getAttribute('data-color'),
        textColor: eventEl.getAttribute('data-text-color')
      };
    }
  });
  
  // fullcalendar
  var d = new Date();
	var month = d.getMonth() + 1;
	    month = (month < 10) ? '0' + month : month;
	var year = d.getFullYear();
	var day = d.getDate();
	var today = moment().startOf('day');
	var calendarElm = document.getElementById('calendar');
	var calendar = new Calendar(calendarElm, {
    headerToolbar: {
      left: 'dayGridMonth,timeGridWeek,timeGridDay',
      center: 'title',
      right: 'prev,next today'
    },
    buttonText: {
    	today:    'Today',
			month:    'Month',
			week:     'Week',
			day:      'Day'
    },
    initialView: 'dayGridMonth',
    editable: true,
    droppable: true,
  	themeSystem: 'bootstrap',
		views: {
			timeGrid: {
				eventLimit: 6 // adjust to 6 only for timeGridWeek/timeGridDay
			}
		},
  	events: [{
			title: 'Trip to London',
			start: year + '-'+ month +'-01',
			end: year + '-'+ month +'-05',
			color: app.color.theme,
			textColor: app.color.white
		},{
			title: 'Meet with Sean Ngu',
			start: year + '-'+ month +'-02T06:00:00',
			color: app.color.blue,
			textColor: app.color.white
		},{
			title: 'Mobile Apps Brainstorming',
			start: year + '-'+ month +'-10',
			end: year + '-'+ month +'-12',
			color: app.color.pink,
			textColor: app.color.white
		},{
			title: 'Stonehenge, Windsor Castle, Oxford',
			start: year + '-'+ month +'-05T08:45:00',
			end: year + '-'+ month +'-06T18:00',
			color: app.color.indigo,
			textColor: app.color.white
		},{
			title: 'Paris Trip',
			start: year + '-'+ month +'-12',
			end: year + '-'+ month +'-16'
		},{
			title: 'Domain name due',
			start: year + '-'+ month +'-15',
			end: year + '-'+ month +'-15',
			color: app.color.blue,
			textColor: app.color.white
		},{
			title: 'Cambridge Trip',
			start: year + '-'+ month +'-19',
			end: year + '-'+ month +'-19'
		},{
			title: 'Visit Apple Company',
			start: year + '-'+ month +'-22T05:00:00',
			color: app.color.green,
			textColor: app.color.white
		},{
			title: 'Exercise Class',
			start: year + '-'+ month +'-22T07:30:00',
			color: app.color.orange,
			textColor: app.color.white
		},{
			title: 'Live Recording',
			start: year + '-'+ month +'-22T03:00:00',
			color: app.color.blue,
			textColor: app.color.white
		},{
			title: 'Announcement',
			start: year + '-'+ month +'-22T15:00:00',
			color: app.color.red,
			textColor: app.color.white
		},{
			title: 'Dinner',
			start: year + '-'+ month +'-22T18:00:00'
		},{
			title: 'New Android App Discussion',
			start: year + '-'+ month +'-25T08:00:00',
			end: year + '-'+ month +'-25T10:00:00',
			color: app.color.red,
			textColor: app.color.white
		},{
			title: 'Marketing Plan Presentation',
			start: year + '-'+ month +'-25T12:00:00',
			end: year + '-'+ month +'-25T14:00:00',
			color: app.color.blue,
			textColor: app.color.white
		},{
			title: 'Chase due',
			start: year + '-'+ month +'-26T12:00:00',
			color: app.color.orange,
			textColor: app.color.white
		},{
			title: 'Heartguard',
			start: year + '-'+ month +'-26T08:00:00',
			color: app.color.orange,
			textColor: app.color.white
		},{
			title: 'Lunch with Richard',
			start: year + '-'+ month +'-28T14:00:00',
			color: app.color.blue,
			textColor: app.color.white
		},{
			title: 'Web Hosting due',
			start: year + '-'+ month +'-30',
			color: app.color.blue,
			textColor: app.color.white
		}]
	});
	
	calendar.render();
};


/* Controller
------------------------------------------------ */
$(document).ready(function() {
	handleRenderFullcalendar();
});