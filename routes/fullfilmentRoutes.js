const {WebhookClient} = require('dialogflow-fulfillment');
const mongoose = require('mongoose');
const Demand = mongoose.model('demand');


module.exports = app => {
    app.post('/', async (req, res) => {
        const agent = new WebhookClient({ request: req, response: res });

        function snoopy(agent) {
            agent.add(`Welcome to my Snoopy fulfillment!`);
        }

        function learn(agent) {
            Demand.findOne({'course': agent.parameters.course}, function(err, courses) {
                if (courses !== null ) {
                    courses.counter++;
                    courses.save();
                } else {
                    const demand = new Demand({course: agent.parameters.course});
                    demand.save();
                }
            });
            let responseText = `You want to learn about ${agent.parameters.course}. 
                    Here is a link to all of my courses: https://www.udemy.com/user/jana-bergant`;
            agent.add(responseText);
            console.log('respText',responseText);  
        }

        function fallback(agent) {
            agent.add(`I didn't understand`);
            agent.add(`I'm sorry, can you try again?`);
        }
        let intentMap = new Map();
        intentMap.set('snoopy', snoopy);
        intentMap.set('learn courses', learn);
        intentMap.set('Default Fallback Intent', fallback);

        agent.handleRequest(intentMap);
    });

} 