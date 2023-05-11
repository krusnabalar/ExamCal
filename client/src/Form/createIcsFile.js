import ics from "../../lib/ics-0.2.0.min.js";

export default function createIcsFile(dataArray) {

  var calendarEvent = ics();
  for (var i = 0; i < dataArray.length; i++) {
    calendarEvent.addEvent(
      `FINAL #${i + 1}: ${dataArray[i][0]}`,
      `Instructor Details: \n Name: ${dataArray[i][6]}, Email: ${dataArray[i][7]} \n\n Location: ${dataArray[i][4]}`,
      dataArray[i][4],
      `${dataArray[i][1]} ${dataArray[i][3]}`,
      new Date(`${dataArray[i][1]} ${dataArray[i][3]}`).addHours(2).toString()
    );
  }
  return calendarEvent;
}
