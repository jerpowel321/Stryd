# Stryd Web Internship Challenge

## Introduction

Hello from the Stryd team!

Thanks for taking the time to complete this exercise. Please submit your solution no more than 72 hours after you receive this project. We're excited to review your work.

In this task, you'll need to setup a small web application to allow someone to view some basic details about their run workout data.

There is a base project in this repo that should get you started building using [React](https://reactjs.org/). However, if you do not know React and feel you could better implement a solution using another framework or method, please feel free to do so.

You will need node and npm or yarn installed on your machine.

Once you have those setup, please clone or download this repo, enter the project directory, and run `yarn` or `npm install` to get all the packages you need.

You'll be evaluated on (in no particular order):

1. Knowledge of JavaScript, HTML, CSS and framework best practices
2. Overall user experience
3. The speed and efficiency of the app
4. The correctness of computations & stability of the app
5. Overall application architecture and code quality

## Requirements

Build an application to help a user analyze some key stats about one of their runs.

The application should use the API endpoint and authentication bearer token provided in `api.js` to request a run JSON from our database. The run should be requested as part of the client app you build, not pre-fetched in a separate process.

There are a few sections that this app should contain:

1. [User Preferences](#user-preferences)
2. [Run Summary](#run-summary)
3. [Laps Table](#laps-table)
4. [Peak Powers](#peak-powers)

### User Preferences

This section should allow a user to change some of their settings, which should in turn change the view of relevant parts of the application.

Users should be able to make the following changes:

1. Select a distance unit preference between `miles` and `kilometers`
2. Select an duration type between `moving` or `elapsed` (See the [Moving vs Elapsed](#moving-vs-elapsed-time) section for more info on what this means)
3. Select a Lap Table view option - either `manual splits` or `distance splits` (See the [Laps Table](#laps-table) section for more info on what this means)

You may choose which options you'd like to use as the defaults on page load.

There is a base component (`components/UserPreferences.js`) that contains a a basic, mostly unstyled implementation for the distance and duration selectors. You should refactor this file to make it easier to add and maintain more selectors of the same type in the future, and then add the new Lap Table View option. You'll also need to update this component so that it can change other sections on the page when the user makes a selection.

**NOTE:** If you are not using React to build your project, you can ignore this refactoring exercise. However, you should still implement the same selectors using your chosen method's best practices.

### Run Summary

The following overall stats about the run should be displayed in the summary section:

#### Run Title

This is the `name` property on the run JSON.

#### Duration

This can be derived from the `timestamp_list` field on the run JSON. This should show either the total elapsed time of the run, or the total moving time depending on the user's duration type preference.

Duration should be shown in HH:MM:SS format (hours:minutes:seconds).

#### Distance

The distance at each sample collected during the run can be found in the `distance_list`

#### Average Pace

The speed at each sample collected during the run is present in the `speed_list` field of the JSON. This should either be the moving average or the elapsed average, depending on the user's duration preference selection.

The units of pace should be in `minutes / (km or miles -- based on user preference)`. The pace should be displayed as a duration string, in HH:MM:SS format (hours:minutes:seconds). Pace should be displayed in this format throughout the application.

#### Average Power

The power output at each sample collected during the run is present in the `total_power_list` field of the JSON. This should either be the moving average or the elapsed average, depending on the user's duration preference selection.

The units of Power is Watts (W).

### Laps Table

While running, a user can record 'laps' by pressing the lap button on their watch.

A lap represents a chunk of time that the user wants to isolate, and compare data with other chunks of time. For example, if I'm running I may hit the lap button at the 1 minute mark, and the 2 minute mark. I would then want to compare my average pace and other stats from the first minute of my run with the second minute.

In the run data JSON, there is a `lap_timestamp_list` property that represents the moments in time a user hit their lap button.

Users also often like to compare their run data based on automatic distance splits (e.g. to compare kilometer 1 with kilometer 10).

You should create a table that shows the user each lap of their run, and the following stats for each lap:

1. The lap number
2. The duration of the lap (either moving or total, based on duration preference)
3. The total distance covered during the lap (miles or kilometers, based on distance preference)
4. The average power of the lap (either moving or total average, based on duration preference)
5. The average pace of the lap (either moving or total average, based on duration preference)

Based on the user's preference for `manual splits` or `distance splits`, the lap table should show these metrics either for each manually recorded lap, or for each unit of distance they have selected as their preference (kilometers or miles).

### Peak Powers

Users like to know what the best average power they can hold for a given duration is. It makes it easy to track improvement over time. For example, if I held an average of 200 Watts for 20 minutes during a race and at my next race I hold 220 Watts for 20 minutes, I know I've gotten stronger.

You should efficiently compute and display the users best average power in the run over the following durations:

1. 10 seconds
2. 3 minutes
3. 5 minutes
4. 10 minutes
5. 30 minutes
6. 60 minutes

## Submission

Submit your solution source code in one of the following ways:

1. A link to a GitHub repo
2. A zip file (without the `node_modules` directory)

If using React, your solution must be able to build using the the `npm run build` or `yarn build` command. If not using React, your application still needs to be built in a way that it could be run and deployed. It can either run locally, or you can provide a hosted link to the application.

## Good luck!

Thanks again for taking the time to complete this exercise. We know these tasks can take some effort, but we have found them very useful to help build a very talented engineering team here at Stryd. We hope you learn something in the process of building this, too.

If you have any questions, don't hesitate to reach out!

---

## Moving vs Elapsed time

There are two ways users like to consider time: Moving time and Elapsed time.

Moving time refers to the amount of time in a run that a person was moving, which we define has having a power value greater than 0, and when the user is actively collecting data.

Elapsed time refers to the total amount of time elapsed over an activity.

Here's an example to highlight the difference:

A user steps out their door, starts their watch to collect data, and starts running. They return home 60 minutes later and end the activity. Their elapsed time is 60 minutes. During the same run, their power dropped to 0 for 10 minutes while they ate a snack. Later, they also paused their watch (and paused data collection) while they stopped and talked to their friend for 10 minutes. While the elapsed time for the run is 60 minutes, the moving time for the run is only 40 minutes.

When calculating Elapsed Average stats like power or pace, you should include the entire elapsed duration when calculating the average.

When calculating Moving Average stats, you should only consider points where the runner has power > 0, and is actively recording data (e.g. their watch is not paused).

## Tooling Notes

This app is bootstrapped with create-react-app. If you'd like more information on their tooling setup, you can checkout their [documentation](https://create-react-app.dev/)

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode and runs any test files you create.<br />
See the create-react-app docs section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the create-react-app docs section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.




## Technologies
- HTML
- CSS
- Javascript
- Material UI
- React
- 




<a href="https://icons8.com/icon/33504/running">Running icon by Icons8</a>



## Credits
- Images
    - Photo by David Marcu on Unsplash

- Icons
     - <a href="https://icons8.com/icon/42788/clock">Clock icon by Icons8</a>
     - <a href="https://icons8.com/icon/43250/speed">Speed icon by Icons8</a>
     - <a href="https://icons8.com/icon/NqzTiK3aS5zz/running">Running icon by Icons8</a>
     - <a href="https://icons8.com/icon/P8Ke8TWgJawk/reflector-bulb">Reflector Bulb icon by Icons8</a>