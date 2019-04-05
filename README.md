# DesignIt

A Reddit clone application for sharing design-related topics. 

Stack: Node.js, Express, Sequelize (postgres)

---

## Set Up

This application is hosted on Heroku [here](https://mxoliver-designit.herokuapp.com) but if you'd like to run it in 
on your local computer follow the instructions [here](#app-configuration)

## DesignIt

This application was inspired by reddit and is a place to share articles and information about the world of design.
Anything from Architecture, to Urban Planning, to Textile and Apparel Design, and more. 

As a standard user you can click into an existing topic and create a new post. Posts have a title, body, and an optional url.
You can also favorite other posts, make comments, and upvote/downvote posts. Your latests posts, comments, and favorites will 
appear on your profile.

Only admin users may create or delete topics.

---

## Follow Up

Refactoring and ideas for the future:

- [ ] I would love to add React to this stack and really flesh out the front-end components

- [ ] I want to set up some kind of link scraping so that adding an article link will create a preview image


## App Configuration

1. CLICK `clone or download` and COPY the link

2. OPEN terminal and run `git clone <link> + (optional <custom-filename-of-your-choosing>)`

3. THEN `cd` into the folder containing the source code 

### Database Set Up

4. run `sequelize db:create` + `sequelize db:migrate` (optional for testing environment: `sequelize db:create --env test` `sequelize db:migrate --env test`

### API Keys

5. In the root directory `touch app.env` to create a file to store your secret keys 

6. You will need a cookieSecret to run the express session add the following into your new .env file

```
cookieSecret='insert random string';

```

7. run `source app.env` in your terminal (there will be no response from this command)

8. finally run `npm start`

you should see something like this in your terminal:

```
> bloccodechallenge@1.0.0 start <path/to/sourcecode>
> node src/server.js

server listening for requests on port 3000
```

4. Once that third line appears (server is listening...) you can go ahead and open your favorite web browser and go to localhost:3000

---
