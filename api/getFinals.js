const playwright = require("playwright");
const { Router } = require("express");
const router = Router();

router.post("/", async (req, res) => {
    try {
        // Open a Chromium browser
        const browser = await playwright.chromium.launch({
            headless: false
        });
            // Open a new page / tab in the browser.
        const page = await browser.newPage({
            bypassCSP: true, // This is needed to enable JavaScript execution on GitHub.
        });
        // Tell the tab to navigate to SSC.
        await page.goto("https://ssc.adm.ubc.ca/sscportal/servlets/SRVSSCFramework");

        // Login to SSC
        await page.type("#username", req.body.cwl);
        await page.type("#password", req.body.password);
        await page.click("input.btn.btn-submit.btn-block");

        // go to Exam Schedule Page
        await page.waitForURL(new RegExp("^https://ssc.adm.ubc.ca"));
        await page.goto("https://ssc.adm.ubc.ca/sscportal/servlets/SSCMain.jsp?function=ExamSchedule");

        // check if Exam Dates are out
        if (await page.frameLocator('iframe[name="iframe-main"]').getByRole('table').count()  <= 1) {
            await page.getByText("Logout").click();
            await browser.close();
            res.send({ data: "Exam Schedule is currently not available" });
            return "Exam Schedule is currently not available";
        }
        // if Exam Dates are out, retrieve relevant information
        const table = page.frameLocator('iframe[name="iframe-main"]').getByRole('table').nth(1)
        const rowCount = await table.getByRole('row').count();
        let examData = [];
        const EXPECTED_CELL_COUNT = 7;
        for (var i = 1; i < rowCount; i++) {
            cell = table.getByRole('row').nth(i).getByRole('cell');
            // checks if row contains exam details
            if (await cell.count() != EXPECTED_CELL_COUNT) { continue; }
            let cellArray = [];
            // form array containing information for one exam
            // [course, date, day, time, location, loc link, alphabetical split, instructor, instr email]
            for (var j = 0; j < EXPECTED_CELL_COUNT; j++) {
                cellArray.push(await cell.nth(j).textContent());
                if (j == 6) {
                        const email = await cell.nth(j).getByRole('link').nth(0).getAttribute('href');
                        cellArray.push(email.split(':')[1]);
                }
            }
            examData.push(cellArray);
        }

        // Logout, turn off the browser, pack our bags and go home
        await page.getByText("Logout").click();
        await browser.close();
        res.status(200).json({ data: examData });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
  });

module.exports = router;