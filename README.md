# Document Management System (DMS)

Hi, and welcome to my Document Management System project! 👋

I built this project because I wanted to understand what actually goes on under the hood of tools like Google Drive or Dropbox. It's easy to take things like "uploading a file" or "sharing a folder" for granted, but I realized there's a lot of interesting complexity when you try to build it yourself.

This isn't just a "CRUD app" — it was a playground for me to figure out how to handle real-world problems like file stream handling, user permissions, and making a UI that doesn't feel clunky.

## Why I Built This
I wanted to challenge myself to move beyond simple tutorials and build something that feels "real."
- **Authentication**: I didn't just want a login screen; I wanted to understand how secure tokens actually work.
- **File Handling**: Uploading an image is one thing, but managing PDFs, versions, and secure downloads is a different beast.
- **UX First**: My goal was to make the app feel responsive. You shouldn't have to refresh the page to see your new file.

## Challenges I Crossed Along the Way
It wasn't smooth sailing! Here are a few things that stumped me (and how I solved them):

1.  **The "Infinite Loading" Spinner**:
    *   *The Problem*: When I first added the profile page, navigating to it would sometimes leave the spinner spinning forever.
    *   *The Fix*: I realized Angular was reusing the component instance, so my data fetching logic needed to run on navigation events, not just initialization. It taught me a lot about the Angular lifecycle.

2.  **File Permissions are Hard**:
    *   *The Problem*: It's easy to hide a "Delete" button from a non-admin, but what if they just Curl the API endpoint?
    *   *The Fix*: I had to implement a robust permission check on the backend `documentController.js`. Now, every request checks `req.user.role` before touching the file system.

3.  **State Management**:
    *   Keeping the file list in sync when you upload a new document without refreshing the page was tricky. I ended up using Observables to make the UI react instantly to data changes.

## How to Run It
If you want to take it for a spin, here's how to get it running on your local machine.

### The Backend (Node/Express)
The engine room.
1.  Navigate to `backend/`.
2.  Install the gears: `npm install`.
3.  You'll need a `.env` file with your MongoDB string (ask me if you need a template!).
4.  Fire it up: `npm run dev`.

### The Frontend (Angular)
The dashboard.
1.  Navigate to `frontend/`.
2.  Install dependencies: `npm install`.
3.  Launch it: `npm start`.
4.  Open `http://localhost:4200` and you're in!

## Future Ideas
There are still a few things I'd love to add when I have time:
- [ ] **Drag and Drop**: For easier uploads.
- [ ] **File Previews**: Viewing PDFs directly in the browser without downloading.
- [ ] **Dark Mode**: Because every app needs a dark mode, right?

Thanks for checking out my code! fast-forwarding through the bugs and learning a ton along the way. 🚀
