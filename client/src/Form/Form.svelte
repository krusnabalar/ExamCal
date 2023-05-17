<script>
  import axios from "axios";
  import createIcsFile from "./createIcsFile";

  let cwl = "";
  let password = "";
  let email = "";
  let invalidEmail = false;
  let emptyField = false;
  let noSchedule = false;
  let emailSelected = false;
  let emailError = false;

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

  // https://stackoverflow.com/questions/1050720/how-to-add-hours-to-a-date-object/1050782#1050782
  Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + h * 60 * 60 * 1000);
    return this;
  };

  const handleSubmit = async () => {
    if (!cwl.length || !password.length || (emailSelected && !email.length)) {
      emptyField = true;
      return;
    }
    if (emailSelected && !emailRegex.test(email)) {
      invalidEmail = true;
      return;
    }
    handleError();

    let details = {
      cwl: cwl,
      password: password,
    };

    cwl = "";
    password = "";

    let examData = await axios.post(
      "http://localhost:5000/api/getFinals",
      details
    );
    examData = examData.data;
    if (examData.data == "Exam Schedule is currently not available") {
      noSchedule = true;
      return;
    }

    const icsFileArray = createIcsFile(examData.data);

    if (emailSelected) {
      details = {
        email: email,
        calendarEvents: icsFileArray.events(),
      };
      let response = await axios.post(
        "http://localhost:5000/api/sendEmail",
        details
      );
      email = "";
      if (response == "Failure") {
        emailError = true;
        return;
      }
    } else {
      icsFileArray.download("Finals Calendar");
    }
  };

  const handleError = () => {
    invalidEmail = false;
    emptyField = false;
    noSchedule = false;
    emailError = false;
  };

  const errorMessage = () => {
    if (emptyField) {
      return "Incomplete Input: Please enter all your details";
    }
    if (invalidEmail) {
      return "Invalid Email: Please enter a valid email";
    }
    if (noSchedule) {
      return "Exam Schedule is currently not available";
    }
    if (emailError) {
      return "Invalid SendGrid Setup: Ensure email is verified";
    }
    return "";
  };
</script>

<div class="form">
  <form on:submit|preventDefault={handleSubmit}>
    <h2>Please enter your details below:</h2>
    <div class="form-input">
      <label for="cwl-input">CWL</label>
      <input
        type="text"
        name="CWL"
        class="input-item"
        id="cwl-input"
        on:input={() => handleError()}
        placeholder="Enter your CWL"
        bind:value={cwl}
      />
    </div>
    <div class="form-input">
      <label for="password-input">Password</label>
      <input
        type="password"
        name="Password"
        class="input-item"
        id="password-input"
        on:input={() => handleError()}
        placeholder="Enter your Password"
        bind:value={password}
      />
    </div>
    <div class={emailSelected ? "form-input" : "form-input-hidden"}>
      <label for="email-input">Email</label>
      <input
        type="text"
        name="Email"
        class="input-item"
        id="email-input"
        on:input={() => handleError()}
        placeholder="Enter your Email"
        bind:value={email}
      />
    </div>
    <label>
      <input
        class="form-input-box"
        type="checkbox"
        bind:checked={emailSelected}
      />
      Send the Calendar File on Email
    </label>

    {#if emptyField || invalidEmail || noSchedule || (emailError && emailSelected)}
      <span class="error-message">
        {errorMessage()}
      </span>
    {/if}
    <div class="button-div">
      <button type="submit">Submit!</button>
    </div>
  </form>
</div>

<style>
  .form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .form-input {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .form-input-hidden {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    visibility: hidden;
  }
  .form-input-box {
    margin: 10px;
  }

  .form button {
    font-size: 24px;
    border: 10;
    border-radius: 10px;
    touch-action: manipulation;
    margin: 10px;
    padding: 3px 10px 3px 10px;
  }

  .input-item {
    width: 70%;
    margin-top: 0.5em;
  }

  .button-div {
    justify-content: center !important;
    text-align: center;
  }

  .error-message {
    color: red;
  }
</style>
