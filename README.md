# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

Ready for deployment.

## Technologies Used

This web application is built with a modern, robust technology stack:

*   **Framework:** [Next.js](https://nextjs.org/) - A React framework for building full-stack web applications with server-side rendering and server components.
*   **UI Library:** [React](https://react.dev/) - A JavaScript library for building user interfaces.
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development.
*   **Component Library:** [ShadCN UI](https://ui.shadcn.com/) - A collection of beautifully designed, reusable components.
*   **Icons:** [Lucide React](https://lucide.dev/) - A clean and consistent icon library.
*   **Authentication & Database:** [Firebase](https://firebase.google.com/) - Used for user authentication (Email, Google, Phone) and the Firestore NoSQL database.
*   **Charting:** [Recharts](https://recharts.org/) - A composable charting library for React.
*   **PDF Generation:** [jsPDF](https://github.com/parallax/jsPDF) - Used to generate downloadable PDF reports for the career assessment.
*   **Language:** [TypeScript](https://www.typescriptlang.org/) - Adds static types to JavaScript to improve code quality and maintainability.
*   **Generative AI:** [Google AI & Genkit](https://firebase.google.com/docs/genkit) - The underlying framework for AI-powered features like career suggestions, the story generator, and avatar creation.
*   **Deployment:** [Firebase Hosting](https://firebase.google.com/docs/hosting) - Configured for deploying the Next.js server-rendered application.

## Development and Deployment

This application is a full-stack Next.js project that uses server-side rendering to provide dynamic AI features.

### Local Development

To run the application locally, use the following command. This will start the Next.js development server.

```bash
npm run dev
```

### Deployment

The project is configured for continuous deployment. Any changes pushed to the `main` branch of your GitHub repository will automatically trigger a new build and deploy the updated application to Firebase Hosting.

To deploy your latest changes, follow these steps:
1.  Add your changes to Git: `git add .`
2.  Commit your changes: `git commit -m "Your commit message"`
3.  Push to the main branch: `git push`
