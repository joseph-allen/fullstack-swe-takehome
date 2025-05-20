# Remote Waitlist Manager

Node Version - v22.15.0

- [Project Board](https://github.com/users/joseph-allen/projects/2)
- [Live URL](https://fullstack-swe-takehome.vercel.app/)
- [API Endpoint](https://fullstack-swe-takehome.vercel.app/api/test)
- [Storybook](https://6823193a638044cca3f86e60-dqlkgbwbev.chromatic.com/)

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
  partySize: 4,
  status: "WAITING", // WAITING, READY_TO_CHECK_IN, SERVING, COMPLETED
  joinedAt: ISODate(),
  serviceStartTime: null,
  serviceEndTime: null,
  notifiedReady: false
}
```

I think the backend can be covered with a few GET and POST requests, with some filtering and maths happening somewhere on the backend or MongoDB itself.

The Front-end can probably be reduced to:

- Join Queue From - Show the current queue state if needed, shows estimated wait time, collects details from users.
- Party Status - Maybe a version of this is availible even before you join the queue.
- Queue Controls - Check In Button and Cancel Queue button

These are just initial thoughts, to be fleshed out on the Projects board.

### Design

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
