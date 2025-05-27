# Remote Waitlist Manager

Node Version - v22.15.0

- [Project Board](https://github.com/users/joseph-allen/projects/2)
- [Live URL](https://fullstack-swe-takehome.vercel.app/)
- [API Endpoint](https://fullstack-swe-takehome.vercel.app/api/test)
- [Storybook](https://6823193a638044cca3f86e60-dqlkgbwbev.chromatic.com/)
- [Local Swagger Deploy](http://localhost:4000/api-docs/)

A full-stack application to manage restaurant waitlists, with real-time seating, queuing, and notifications for diners. Takehome task for TableCheck.

# Table of Contents

1. [Setup](#setup)
2. [Diary](#diary)

# Setup

### Quick run with Docker

```
docker compose up
```

You may need to build for Windows devices first

```
DOCKER_BUILDKIT=1 docker compose build --no-cache
```

### Mongo

Shell with mongo-shell
`mongosh mongodb://root:example@localhost:27017`

Then run:

```
use my-db
show collections
db.parties.find().pretty()
db.system.find().pretty()
```

### Running locally

If you've never run a Next app locally before, this more verbose guide is for you.

#### 1. Install Node.js (via NVM)

We use [`nvm`](https://github.com/nvm-sh/nvm) to manage Node.js versions.

##### a. Install `nvm` (macOS/Linux):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Then restart your terminal.

##### b. Install `nvm` (macOS/Linux):

This project includes an .nvmrc file, so you can run the following to set your version in this folder.

```bash
nvm install
nvm use
```

#### 2. Set Editor settings for VSCode

```
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Quick setup

For a user who already has this all setup, you have access to the usual npm commands:

- npm install
- npm run dev
- npm run build
- npm run start
- npm run test
- npm run lint

### Storybook

Open Storybook locally with:

```bash
npm run storybook
```

We can also deploy Storybook to Chromatic with

```bash
npx chromatic --project-token=chpt_b609d47135590e0
```

# Diary

1. [Initial thoughts](#initial-thoughts)
2. [Project Setup](#project-setup)
3. [Solution](#solution)

## Initial thoughts

Having read multiple blog posts from the TableCheck tech blog, I stumbled upon [the fullstack tech test](https://github.com/TableCheck-Labs/fullstack-swe-takehome). My intial thoughts are that this is highly technical, and I haven't done a take home task in a while. Despite that, I like a structured oppurtunity to learn and don't have a recent tech test up so regardless of the outcome, this looks like a good use of my time.

My hunch to start, would be to replicate the tech stack outlined in [Frontend engineering at TableCheck](https://www.tablecheck.com/en/blog/tech/frontend-engineering-at-tablecheck/), but my recent experience is more Next.js focused and I think I'm going to need to move quickly. This also means I get API routes, SSR and the benefits of deploying with Vercel itself.Thinking ahead to deployment, this stack means I could handle my deployment with a single instance on Vercel, and have the Database hosted elsewhere.

Leaving me with the following Stack as a starting point:

## Stack intuition

- Framework: Next.js (React + TypeScript)
- State Management: XState
- Styling: Emotion
- Reusable Components: Storybook
- Database: MongoDB
- Deployment: Vercel + MongoDB Atlas
- Docker: local deployment + requirement from tech test

There are many additional requirements in the tech test, notably:

- Runnable with `docker compose up`
- "the user must be able to view the state of their queued party across multiple browser sessions."
- Add github users

## Project Setup

At this point, I'm ready to create a walking skeleton of working components along, roughly outlined below, but please see the Projects Board on Github:

- Setup Next.js with TS.
- Setup Emotion
- Setup XState
- Setup MongoDB and MongoDB Atlas
- Docker
- .env local files
- Setup Jest for unit testing
- Setup Cypress for E2E
- Setup Prettier and ESLint
- Setup Husky pre-commit prettier and jest

### 1. Setup Next

On a hunch I'm checking my node version, currently fixed to v22.14.0 for another project. So moving to latest.

I always find myself coming back to projects annoyed it's not obvious what versions the project is locked to, especially on older, maintained projects. So I always throw this at the top of the README too.

While we are here, let's add some extremely accessible "How to start a Next project" installation instructions.

I'm not certain on the shape of my docker file yet, but I know my requirement is to have it run simply.

### 2. Style solution

My choice of Next immediately backfired, in a view to make my API a self-documenting one I forgot the complexities added by having the option of easy SSR with Next and Vercel. This meant I was burrowing down for the edge case of a working example or Emotion, with Next, with SSR, in these particular versions of React and Emotion. This has been shockingly turbulent over the last few versions and after spending too long on what should have been "out-of-the-box" I instead decided to not use SSR in my client-side components.

Had I known this, I think I would instead use Material-UI with Tailwind for inline styles, considering this is a faster prototyping project, but I think for a larger project I was more along the right track here.

### 3. Setup Xstate

A take home task is a great time to try something new, and I haven't used xState before but Finite State Machines feels like something that should be part of state anyway. This seems to be a viable replacement to Redux in a newer app, but at the same time the conflation between Redux, Flux, xState and beyond keeps reworking similar ideas so while I can track it enough now to implement a basic button, it will be interesting to see if this helps my project.

### 4. Setup MongoDB + Docker + Deployments

MongoDB was a requirement, and is what I'm use commonly as Next.js + MongoDB covers most use cases I face. I'm normally required to interact with MongoDB, but not code it myself so I anticipate needing some helper scripts to "reset" and "populate" this database as part of the front-end.

I use WSL, as I'm on a Windows machine for now and setting this up with MongoDB is a pretty awful experience. Luckily, since a later requirement is to move over to a Docker script I'm bringing that in now.

At this point I have the Docker Compose script building an empty MongoDB, which I can sucessfully hit from within my Next App, also dpeloyed inside the Docker Container locally. Next my plan is to update the deploy on Vercel to continue to deploy the Next App, and find a solution for deploying MongoDB instances so that I have a "dev" and "prod".

I feel a need to mention is strange edge case, I'm coding on Windows and many docker images don't work on Windows OS. I would have expected the point of Docker to be that you could run your containers anywhere, but I suppose people aren't running those containers on Windows machines much, so apologies I had to include Docker Buildkit so while you may be able to run the simple docker compose required, I will not.

Happily, I've satisfied the requirement to run on `docker compose run` without having to do so intentionally.

### 5. Setup Storybook + Chromatic

Storybook to slowly maintain our own component library, allow visual testing and Chromatic to perform and approve snapshot testing.

At this point I realize I've made a pretty mature outline of what should be a basic tech test, and I'm aware these things aren't being used well, and will add a lot of work but I think it's important I show the kind of project setup I would do over just the programming. Hopefully I don't have to reuse this repo for another tech test, but at this point it's a good Next+Mongo Template.

### 6. Setup E2E testing with Cypress

Starting Cypress from the inception of a project makes a lot more sense, it's a trivial and enjoyable experience to add. I've always been unsure as to when E2E tests should run, the last project I worked on, E2E tests took over 6 hours to run, and became a complete blocker of the pipeline. Because of this they ran it once overnight, which often meant morning rollbacks. My hunch, is that lots of tests accomadated for timing out or something strange because at the moment, it's quite quick. Github actions on push and pull request seem like a right level for now.

### Solution

I think at this point, I have my stack setup with basic examples. A brief outline of my intended solution is as follows:

1. Full-Stack Next.js - This is my solution to front-end and back-end with options for isomorphic SSR. API is largely self-documenting and won't require me to setup another project.
2. MongoDB - Chosen for it's ease of setup with Docker.
3. Server Sent Events - While Websockets might be ideal, I'm going to try for Server-Sent Events to push status updates to the client.
4. Client-side partyID - Setting a partyID for the user in localstorage can maintain a connection to their status, across sessions without a complicated authentication problem being solved.
5. Queue Processing - Backend responds to Server Sent Events by processing the queue as availibility arrives.

In the interest of keeping things short, but open to refactoring I have a notion of "A resturant" and a notion of "Parties", where a party is described as follows:

```
{
  _id: ObjectId(),
  partyId: "unique-uuid-string",
  name: "The Smiths",
  size: 4,
  status: "WAITING", // WAITING, READY_TO_CHECK_IN, SERVING, COMPLETED
  joinedAt: ISODate(),
  serviceStartTime: null,
  serviceEndTime: null,
  notifiedReady: false
}
```

I think the backend can be covered with a few GET and POST requests, with some filtering and maths happening somewhere on the backend or MongoDB itself.

The Front-end can probably be reduced to:

- Join Queue Form - Show the current queue state if needed, shows estimated wait time, collects details from users.
- Party Status - Maybe a version of this is availible even before you join the queue.
- Queue Controls - Check In Button and Cancel Queue button

These are just initial thoughts, to be fleshed out on the Projects board.

### Design

### Front-End

I'd expect to work from an existing design, so I think making my own wireframes is a good way to make sure I've covered the featues I expect.

![Wireframes](https://github.com/user-attachments/assets/1778aca3-3044-4200-9aae-0656680c50dd)

While we don't always get the chance to see a fully-designed app before we start development, this time we do so we can make a decision on our component structure before we start. I'm undecided as to whether we should pre-design components, or abstract them out as we justify uses for them. For the sake of simple tickets though, I will design the components first.
![Wireframe-components](https://github.com/user-attachments/assets/6931713d-1b80-4513-994e-d59eaa2ce290)

Outline:

- Layout - Usually I'd use an app-level layout to add a header/footer and brand information and simple SEO details.
- Container - Following a Container / Component layout, I can use this top-level container to handle a lot of the logic meaning components below could be entirely functional.
- Status - A Component which renders the expected wait up, alerts status changes and current party details.
- Form - We can keep the form data seperate, with the container controlling whether or not it renders.
- Loading - Commonly forgotten Loading/success/warning states which could be considered outside of component logic.

This can be implemented, regardless of the API development with some good unit tests.

Note: I spent a long time on setup here, I wanted to show the kind of project setup you can expect from me, and it's been a few months since I last thought about what stack I would start with. I think if I went through this again I'd probably have added Material UI and theming as a demo. I'd consider this all outside the scope of your initial task, but it's useful to me for the other take home tasks I am recieving anyway. I removed any TableCheck context and made a standalone [template repo](https://github.com/joseph-allen/next-mongo-template).

### Back-End & DB

At the start of this project I decided that, whatever state the backend is going to be, I will need the front-end made. As I reach the finish of my front-end components I've learnt a lot more about the context.

I feel I'm at a splitting point between how I'd implement things in the real world, and what is required for this tech task. Features that would have made more sense in the real world, like tracking your queue position, estimating wait times and more are simply out of scope. It's harder than I thought to seperate from the context of the real world and I find myself returning to your prompt.

While I was previously happy to use Next.js's backend, I realise now that something between my Next App and the MongoDB is required. Somewhere there needs to be logic that simulates the 3 second dining reuirement. This could be in a clever Queue structure, like mongodbq. This could also be a standalone Express app, solely responsible for simulation.

Were this a real app, I would lean more heavily on the MongoDB, with the ability to store 1000s of resturants in the relevant collections. I'd also expect the resturants themselves to control the expiry of tables, meaning my backend would be less of a simulator and more of a broker. With the need for security for access to said database, I can't keep the MongoDB in the same Docker container, with exposed default username password combinations alongside the environment variables that would give full access. Again I am determining that to largely be out of scope.

Finally there is the question of how notifications are handled. Polling is the simplest thing I can think of, which would work with this flow, for a single small resturant. The simulation requirement makes this difficult, where in the real-world I could expect end of service events from the resturants. I can go further with SMS notifications, WebSockets or Server-Sent Events, but considering the time spent on this I'm going to go simple.

So the structure I am ending up with is as follows:

- Next.js App, with API requests from said app, only to the backend, including polling.
- A Backend - I've not decided if this will be Express + Node.js or a Flask app. This backend will handle the simulation of diners, and update rows in the database to determine seat availibility.
- A MongoDB - collections representing the queue, resturant and parties can all fall here.

When I say queue, I could be referring to a diner queue, or a queue in the waitlist too.

So the flow is as follows:

1. User Arrives -> Tries to Sit. If they can't sit they are prompted to fill in the form.
2. User joins waitlist -> POST /api/waitlist
3. Backend runs a loop every few seconds, processing the queue.

- check all seated parties
- now - seatedAt >= size x 3s, mark as done, and increase availableSeats += size
- While availableSeats allows - pop earliest waiting party and process.

4. We assume customers are seated automatically and handled by the resturant, ending our flow. Users press a check-in button in their app, as required.

Mongo:
Parties

```
{
  uuid: String,
  partyID: String,
  name: String,
  size: Number,
  status: "waiting" | "seated" | "done",
  createdAt: Date,
  seatedAt?: Date
}
```

System

```
{
  totalSeats: 10,
  availableSeats: 6
}
```

API Endpoints:

- GET /api/seats - availible seats number
- POST /api/waitlist - Add party to waitlist
- GET /api/user-info/[uuid] - get user details, for this browser if UUID already exists (accidental closed tab)

### Real-life context

Instead of focusing on the simulation aspect, I thought about real life. Any resturant I've seen using this system usually can take orders by scanning a QR Code, and has a TV screen in the resturant that shows upcoming orders, or ready to serve orders. I've seen this in sushiro, kura sushi and din tai fung. I notice in their implementation, something lacking in mine. Where I was going to use a unique front-end generated ID to represent my users, a simple incrementing ID (say resetting daily so that ResturantID + Date + ID would form a UUID) means that we could show the most recently seated table, as an indication to all users. This means instead of polling in case the user is ready to seat, we are updating the users estimate as well as the desired functionality of seating the diners.

I'm still going to generate and store the UUID from the user. This way we move away from the queue data structure, a database makes more sense, and extensability is simple. We could with this structure, have that TV Screen in-resturant. We also give a second chance to those who miss their slot.

### Features

#### Material UI

I've immediately realised I'd much rather have Material-UI, while I could write my own styles fully I think Material-UI adds an immediate boost that when devtime is a priority, such as a tech test, it's worthwhile. The SSR setup in Next is a lot more trivial than bare Emotion too. I figured out the Global style provider uses createContext, preventing SSR.

I had a play with the TableCheck colors using the recommended [pallette-generator](https://m2.material.io/inline-tools/color/) and the [theme generator](https://zenoo.github.io/mui-theme-creator/). I thought theming would be a quick win here, but SSR adds complexity so I am going to come back around to that when I have a place for the theme toggle.

#### Loading Component

I decided to start with this as it's the simplest component, allowing me to get my bearings within my own project. I've not decided if this is for the "waiting" animation, or if this is for the loading state after the form is posted. I'm not sure that matters as it could serve both of those. I decided to implement this as TDD, there's no data flying around yet and my expectations for this component are quite simple.

I used Lordicon to make a custom animation here over a themed Circular Progress from from Material-UI. I think this animation is going to be watched a lot, and with a better tool I'd make some sort of transition between multiple well-styled icons but this will do for now. I chose APNG as it supports transparent backgrounds, has [96% support across browsers](https://caniuse.com/apng) (though I could have gone more legacy with a gif if needed.)

I added some loading ellipses after that are optional. I'm not sure this looks any better but figured it would make this component a little more interesting for you to review. So if you made it to this point please check out the following:

- next-app/src/stories/LoadingComponent.stories.ts
- next-app/src/components/LoadingComponent.tsx
- next-app/\_\_tests\_\_/components/LoadingComponent.test.tsx

#### Status Component

- next-app/src/stories/StatusComponent.stories.ts
- next-app/src/components/StatusComponent.tsx
- next-app/\_\_tests\_\_/components/StatusComponent.test.tsx

Another simple component. My thinking here is that my Container can use an xState machine, and that state can be passed down to this component to change it's rendering. I could have done some clever nested checks to render parts as needed, but I felt since the state is controlled so well with xState that keeping to a single state check makes the component far more readable. Rendering could be done conditionally based on provided props too, if there is no estimated wait time are we at the front of the queue? If there is no party Id then we must be in the idle state. These would be clever choices, but the trade-off to readability felt obtuse.

I'd saved it as a bonus, but again since the states are so obvious and front of queue is a celebration state I added confetti to celebrate and get the users attention if they were holding the screen open but didn't notice any changes. Confetti is TableCheck brand colors but I think I could add a simple CRM / resturant endpoint that we hit from the URL that could flavor our loading image and this confetti.

#### Form Component

That's the last of our simple components. We move on to our form. At this point I haven't stubbed out a loading and warning state, often forgotten in designs and later a frantically added feature when an innevitable waiting state is added to the real submit action.

react-hook-forms is a lovely package that gives you handles all the validation and state issues that can come with handling multiple form inputs. Combined with this, Material-UI has beautiful googly inputs with built in error handling. The difficulty in this component is combining the functionality of both components.

The name field is simple enough, we can assume it's non-empty for now. Some name inputs might set a minimum length higher than 1 but I've found that a western pattern. I have a friend with a two character last name, and a partner with a 20 character double-barelled last name. Not to mention character-based languages like Japanese where a single or two kanji name is a common and valid use-case.

Number of diners requires some context from the resturant. I plan to stub out a CRM response for the sake of this demo, where details like largest table, resturant capacity etc can be pulled from. For now I will assume the most common diner type is a single diner, another feature that could be pre-processed and handed to the UI. My original hunch was to use different icons for different "personas":

- Single diner - a meal icon, rather than anything isolating
- Couple - a non-romantic icon of two diners.
- Group - 3+ diners together, not implying children
- Party - Something representative of a large group or crowd

I struggled to find a consistent icon pack for this, with no in-house designer. I decided to instead simply render the number of diners visually, hoping that the number in the box and number of diners as icons is enough to display what this section means. The label "party size" feels out of place, but I think it's necessary. I've lazily added an animation as they pop in, and used animated icons to give this simple component a lot more character. I'd need a different set of icons for a dark mode, but already the icons I have been using can be re-colored within React using react-lottie. That's out of the scope of this tech task but something I'd rather do.

#### Layout and XState

At this point I have all the components I need, but no way to walk through them or really test them, a down side of this approach. I took advantage of Next.js route groups, to render a layout for the home page, without generating a layout that would default apply to all pages. Then I could use the default page of that route group, as the home page itself.

For now, this page is a app-level router, routing the user through parts of the flow in the same application. The app state itself, felt like a good oppurtunity to use XState as it made it very clear where I was in the queuing process. There are a few points a user could fall out of, or reset their step in the process as well so this gave a good an flexible way to do that.

While writing the initial test Button component with an XState machine, I found a pattern where you write a Hook, to simplify access to your Machine, and this felt like it tidied up my home page.

Again I feel like I could have used a lot of nested if statements throughout the about page, but I tried to stick to stepping through the states for easy debugging. Some bits of text and dev buttons felt like they didn't belong inside my components, but also didn't warrant their own components so I left these floating as helpers in the page itself.

When I came to submit I realised my pre-commit hook didn't check for TS errors, which would later fail the build so I decided to take this time to tidy up some stray TS issues I'd seen in my editor. I extracted my first globally useful type up to a types folder too and realised I should probably have some sort of global style variables as I am picking and choosing colors and spacing to not get distracted. I made the site responsive with a single line change thanks to Material UI.

I really enjoyed XState. I always felt Redux could be quite verbose, and requires you learn it's terminology to think of it the right way. Finite State Machines are about as simple as Computing gets, and was something I was already familiar with. There are some useful functions later, like the ability to invoke functions from calls that could come in handy with the queue processing.

#### UUID

Persisting the user across refreshes can be done with a UUID. I did this first with local storage for simplicity. I think I need the expiring nature of a cookie, as a diner could come back a few hours later. Expiry should be shorter than the longest table wait. This could probably be safely limited to "service time" with an option to reset the queue provided to the user. The cookie can hold the UUID, which will be sent with all API requests, meaning I can trust the API requests to identify the user.

#### Backend

I've decided to get to a walking skeleton state as fast as possible. My front end needs to be able to get information all the way from the database. I could put things directly into the database from the front end, but since I will need the backend at the very least to simulate dinners it makes sense to proxy things through it.

I've got a simple function that pings the DB every ten seconds, which will evenutally become the notification system. While this is greedy, it will let us update queue position quickly. This could be replaced with SSE or WebSockets later but I'm going to call that out of scope for this task.

Docker compose let's me have a seperate docker container for each service, and a Next.js proxy removes CORS issues without me explicitly setting up CORS.

#### Database

I think the database could be unecessary for the sake of the tech test, but if I think about the real-world problem adding a resturant ID, and a date would basically let us analyse individual days service and give recommendations to resturants and predict their service.

I think MongoDB is a good choice, in that it's extremely fast and flexible to get started with, and really we aren't doing much querying in this project. We will probably do some reduction and grabbing documents by index. Querying could have been helpful for grabbing individual states, but realistically a resturant is only going to have at most around 100 tables so we can be quite greedy algorithmically.

We've got the issues of a monorepo now as well, while docker compose is happily handling that complexity, I would move parts out to git submodules if this were a more serious project.

I've also lost view of the production deployment I had at the start. My E2E tests, and automated deploys are still working but as soon as I begin to incorporate API calls and real data into the system that won't work anymore. I also don't have any method of deploying the DB and backend at the moment. I'm going to call that out of scope but we could be using SQS queues, load balancers and CDN's to make this even more over-engineered.

I've initialised the mongoDB with some example data, so extending this so the resturant starts full, and we have a notion of the system of the resturant means a user may actually need to queue. I added an auto-incrementing "ID" purely for the user so they aren't exposed to their UUID. Again this is a pattern I've seen at many resturants and I think it gives the benefit of a "waiting time estimation" that stranger ID's don't give. This doesn't help the data structure, as mongoDB documents can be sorted by insertion time. There is functionality in this script that should be moved to my backend. For now I wanted to make sure MongoDB could hold and manipulate documents as I required.

#### Posting new Parties

With all the work done so far, adding a new endpoint is trivial. I decided to take the easiness of this task as a gap to formalise the backend a little. We now have auto-generating Swagger API documentation, a place for backend Schemas, and a place for routes. The main server file is growing in complexity so I'm moving out anything that is cluttering that file.

At this point the backend posts are tested, and working but not yet integrated into the front-end. This will be the first time we use real data and actions in our front-end, meaning we are about to make all our tests there require mocking and a decision as to whether we update E2E tests or not.

That concludes what I think will be the largest PR of the entire project, once I had the real partyID back from the API the rest of the front-end flow worked without much integration. I had some issues with the MongoDB that took a while to resolve, and I took this as a change to move some logic around into helper functions with their own tests, bringing out environment variables which would normally be in a .gitignore. Since this PR bridges all our pieces more formally, we had to lock types and variable names more intentionally so there was a bit of tidying up here that fluffed up this PR that really should have come in seperate tasks.

#### Updating existing parties

For a RESTful API, I think the right choice here is to make a single endpoint to patch the status of parties. I could make things more maintainable by splitting this route into two helper routes for setting a party to seated, and done and seperating out the logic from there.

I've got the polling of the database working here, so now I need to finally decide on where the queue processing is going to happen. Allowing users to check in reduces complexity as I can trust my users to check in and I will simulate them moving to done later. It's a huge assumption to trust users to check in in real life, given more time I'd probably have some element of notifying the user a few times, before expiring. In real resturants I've seen this expiry treated fairly kindly with a reinsertion to the top of a queue.

At this point, I think adding two more values to my system collection would allow my front-end to respond to that entire collection to handle state, and table readiness.

```
"nextPartyId": "101",
"nextPartySize": 4,
"totalSeats": 10,
"availableSeats": 6
```

would mean any next poll, would have all information needed to confidently offer a table to party 101.

I'm just going to add some table visualisation to the little dev panel now to prepare for this. I've fleshed out the dev panel now too. I wouldn't include this in a real site, but considering the rapid state changes we expect from the database and backend this is quite a nice way for me to visually confirm things look correct as I play around. A version of this panel could be what the resturant sees, or even a progress bar for the user while waiting.

Polling is working much better than expected. I suppose the size of the resturant is so small, even if it had 100 seats or tables a greedy approach simulating them would still be fast. In the real world I'd expect this to be handled by the resturant somehow. While we could have threads running for each table, emitting SSE, or even use WebSockets I think I will leave that out of scope and try to tidy up what I have now. The tickets on the board are mostly done, save a few missed bits of logic that I'm going to try to stomp down and test.
