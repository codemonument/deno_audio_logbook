# Audio Logbook 

A deno fresh server, with a telegram bot to receive audio messages
and a website to show all messages of a user in a calendar. 

---

# Developer's Section 

## Usage 

### Start
Start the project:

```
deno task start
```

This will watch the project directory and restart as necessary.

### Connect to DB locally 

Prerequisites: 
- Installing pscale cli 
- Logging into pscale cli with `pscale auth login`
- Getting access to the org where your db is hosted & your db

Run:

```
deno task db-connect

> Secure connection to database jbscratch_planetscale-in-deno and branch main is established!.
> Local address to connect your application: 127.0.0.1:3306 (press ctrl-c to quit)
```

Now you can connect to `localhost:3306` with user root and no password with any MySQL capable tool!


## Useful Documentation Links

- Fresh Docs: https://fresh.deno.dev/docs/introduction
- Fresh Example Chat App: https://github.com/denoland/showcase_chat/tree/main
  - Has been useful for getting the login code right!
- Telegram Bot API Docs: https://core.telegram.org/bots/api
- Telegram In-Depth Guide for Webhook based Bots: https://core.telegram.org/bots/webhooks
- Telegram Guide for 'Login with Telegram'-Widget: https://core.telegram.org/widgets/login

## Infrastructure 

- Dev Environment: http://localhost:8000/
- Prod Environemtn: https://deno-audio-logbook.deno.dev/


- Deno Deploy Dashboard: https://dash.deno.com/projects/deno-audio-logbook
- Planetscale DB: https://app.planetscale.com/bjesuiter/jbscratch_planetscale-in-deno
- Doppler Dashboard: https://dashboard.doppler.com/workplace/e6fccc45622fbb7e71e5/projects/deno_audio_logbook
- MinIO Bucket: https://dashboard-minio.storage1500.vserv.fun/buckets/deno-audio-logbook/browse