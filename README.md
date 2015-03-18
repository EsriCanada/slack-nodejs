## Slack Node.js Service
A simple Node.js service to process customizations in [Slack](https://slack.com/).

### How it Works
- A [Slack Command](https://api.slack.com/slash-commands) is used to send a POST request to a Heroku instance.
- The data is processed and a POST request is sent to an [Incoming Webhook](https://api.slack.com/incoming-webhooks).
