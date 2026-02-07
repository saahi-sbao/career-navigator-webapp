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

### Deployment Checklist

To ensure your application is published successfully, please follow these steps:

1.  **Verify Firebase Project**: Make sure your Firebase project has the **Blaze (pay-as-you-go) plan** enabled. This is required for server-side features like the AI Story Generator and Study Coach, which run on a server backend (App Hosting on Cloud Run).

2.  **Test Production Build Locally**: Catch potential errors before deploying by building the app for production on your local machine. Run the following command:
    ```bash
    npm run build
    ```
    If this command completes without errors, your app is likely ready for deployment.

3.  **Deploy via Git**: The project is configured for continuous deployment. To deploy your latest changes, simply commit and push your code to the `main` branch:
    ```bash
    git add .
    git commit -m "Final changes before deployment"
    git push
    ```

4.  **Monitor Build Logs**: After pushing, go to your **Firebase Console**, navigate to the **Hosting** section, and view the latest deployment. You can monitor the build and deployment logs there to ensure everything completes successfully.
