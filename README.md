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
