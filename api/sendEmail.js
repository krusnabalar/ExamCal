const sgMail = require("@sendgrid/mail");
const { Router } = require("express");
const router = Router();

router.post("/", async (req, res) => {
	try {
		let calendarContent = "BEGIN:VCALENDAR\nPRODID:Calendar\nVERSION:2.0\n";
		calendarContent = calendarContent.concat(req.body.calendarEvents.join("\n"), "\nEND:VCALENDAR");
		const attachedIcsFile = [{
			filename: `Finals.ics`,
			type: "text/calendar; method=REQUEST",
			content: Buffer.from(calendarContent).toString('base64'),
			content_id: `Finals`,
		}];
		sgMail.setApiKey(process.env.SENDGRID_API_KEY);
		const msg = {
			to: req.body.email,
			from: req.body.email,
			subject: 'Finals Calendar Event',
			text: 'Please see the attached iCal Invite for your final exams this semester',
			html: '<strong>Please see the attached iCal Invite for your final exams this semester<strong>',
			attachments: attachedIcsFile,
		};
		try {
			await sgMail.send(msg);
			res.status(200).json({ message: "Success"});
		} catch(err) {
			res.status(200).json({ message: "Failure" });
		};
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
})

module.exports = router;