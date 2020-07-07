<p align="center">
  <img src="https://www.ocf.berkeley.edu/~branchan/images/tabr-1.png" alt="Shootup Survival iTunes Artwork"/>
  <br/>
  <b>tabr - 2018</b>
</p>

A React-based guitar tab editor and viewer.

## Tools
Made with Express.js, sqlite3, and React. Install all three dependencies. The primary React app is ran with `npm start`. Run the server with `node server/server.js`.

## What's cool?
- The REST API that the server implements allows a user to modify tabs without changing any code.
- Measures can have different note denominations.

## What's not cool?
- You'll need to swap out the sounds in the `public/sounds` folder.

## Lessons
- REST APIs are essential to creating web apps that save and retrieve data.
- CSS styling with Flexbox is a life saver.
- Copying and pasting measures is a life saver.
