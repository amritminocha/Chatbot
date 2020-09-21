const chatbot = require("../chatbot/chatbot");

module.exports = (app) => {

  app.post("/api/df_text_query", async (req, res) => {
    let responses = await chatbot.textQuery(req.body.text, req.body.userID , req.body.parameters);

    // .then((responses) => {
    //   console.log("Detected intent");
    //   const result = responses[0].queryResult;
    //   console.log(`  Query: ${result.queryText}`);
    //   console.log(`  Response: ${result.fulfillmentText}`);
    //   if (result.intent) {
    //     console.log(`  Intent: ${result.intent.displayName}`);
    //   } else {
    //     console.log(` No intent matched.`);
    //   }
    // })
    // .catch((err) => console.log(err));
    res.send(responses[0].queryResult);
  });

  app.post("/api/df_event_query", async (req, res) => {
    let responses = await chatbot.eventQuery(req.body.event, req.body.userID , req.body.parameters);
    res.send(responses[0].queryResult);
  });
};
