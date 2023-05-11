<script>
  import Form from "./Form/Form.svelte";
</script>

<svelte:head>
  <title>UBC ExamCal App</title>
  <meta name="description" content="UBC ExamCal App" />
</svelte:head>

<section>
  <h1>UBC ExamCal</h1>
  <div class="form">
    <Form />
  </div>
  <div class="about">
    <div>
      Download the ical file for your UBC finals by filling the form above,
      provided the dates are out on SSC. If you choose the email option, you
      will have to set up a Twilio Sendgrid Account and add the API Key as an
      environment variable.
    </div>
    <!-- <a href="/" class="text-blue-600 dark:text-blue-500 hover:underline ml-1">
      Warning:
    </a> -->
  </div>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    text-align: center !important;
    flex: 0.6;
    height: 100%;
    background-image: url("https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    background-attachment: fixed;
  }
  h1 {
    width: 100%;
    margin: 0px;
    background-color: white;
    padding: 10px 0px 10px 0px;
    text-align: center;
  }
  .about {
    background-color: white;
    padding: 10px 0px 10px 0px;
    text-align: center;
    width: 50%;
    border-radius: 10px;
  }
  .form {
    background-color: white;
    border-radius: 8px;
    border-color: black !important;
    border: 10 !important;
    padding: 40px;
  }
</style>
