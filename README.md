NOTE TO REVIWERS: I Understand Why one would claim that I am using over 30% of AI code based on how the website looks like, I want to give y'all some background info on how I used AI and how I made this site. I started off with human code for the CSS HTML and JS I kept using Human code for the HTML and JS But let AI decide on the CSS due to low knowlage on how to make a cool graphic and stuff. I also used copilot to review my code to let me know chnages I could make and what is the best paritice for code. I hope the person reading this understands that I did not use over 30% to code my project of AI and I used it as a tool to help me learn the best paritces and give me ideas on how to create the website from the design to the code There is still a human behind it programming it just that the human used AI to enhance the code to make it more professional by asking it what the best paritice for the format and coming up with ideas for new UI designs to help make the site better and to help me improve.

# Orbit — NASA APOD

Orbit is a space-themed web experience built around NASA's Astronomy Picture of the Day (APOD).

 **Live Website:** [apod-site-orbit.vercel.app](https://apod-site-orbit.vercel.app/)

 **Source Code:** [APOD-SITE-ORBIT](https://github.com/albertphu07/APOD-SITE-ORBIT)

---

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML | Web page structure |
| JavaScript | Application logic |
| Vite | Development server and production build |
| NASA APOD API | Astronomy picture and information source, if configured |

## Getting Started

Run Orbit locally on your computer.

### Prerequisites

- [Node.js](https://nodejs.org/) with npm
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/albertphu07/APOD-SITE-ORBIT.git
   ```

2. Navigate to the project directory:

   ```bash
   cd APOD-SITE-ORBIT
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL printed in your terminal, usually `http://localhost:5173`.

## Production Build

Build the project for production:

```bash
npm run build
```

The optimized production files will be generated in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

## Deployment

Orbit is linked to a live deployment on Vercel.

To deploy your own copy:

1. Import the repository into [Vercel](https://vercel.com/).
2. Allow Vercel to detect the Vite project.
3. Use `npm run build` as the build command.
4. Set `dist` as the output directory.
5. Deploy the project.

If the application uses a NASA API key, configure it through your deployment environment variables as required by the code.

## About NASA APOD

NASA's Astronomy Picture of the Day features a different astronomy image or photograph each day, often accompanied by an explanation written by a professional astronomer.

Learn more:

- [NASA APOD Website](https://apod.nasa.gov/apod/astropix.html)
- [NASA APOD API Documentation](https://github.com/nasa/apod-api)

## Author

Created by [albertphu07](https://github.com/albertphu07).

## License

No license has been specified in this README. Check the repository's license before reusing, modifying, or distributing the project.

---

**Look up. Explore further. Discover the universe. 🌠**
