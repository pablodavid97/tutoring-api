const utils = {};

// function to change datetime format for readability
utils.getDateTimeValues = (dateString) => {
  date = new Date(dateString);

  var month = date.getMonth() + 1;
  var day = date.getDate();
  var year = date.getFullYear();
  var dateString = day + '/' + month + '/' + year;

  var hours = date.getHours();

  var format = {};

  if (hours == 0) {
    hours = 12;
    format = { text: 'AM', value: 1 };
  } else if (hours < 12) {
    format = { text: 'AM', value: 1 };
  } else {
    if (hours != 12) {
      hours = hours - 12;
    }
    format = { text: 'PM', value: 2 };
  }
  var hoursString = String(hours);

  var minutesString = ('0' + date.getMinutes()).slice(-2);

  return [dateString, hoursString, minutesString, format];
};

module.exports = utils;
