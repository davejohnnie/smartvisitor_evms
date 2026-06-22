import "../css/app.css";
import "./bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import ErrorBoundary from "./Components/ErrorBoundary";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { router } from "@inertiajs/react";

router.on("start", () => {
    document.body.classList.add("inertia-loading");
});

router.on("finish", () => {
    document.body.classList.remove("inertia-loading");
});

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx"),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ErrorBoundary>
                <App {...props} />
            </ErrorBoundary>,
        );
    },
    progress: {
        color: "#3F6B4F",
        showSpinner: false,
    },
});
