import { Metadata } from "next";
import OfflineClient from "./client";

export const metadata: Metadata = {
    title: "Hors ligne | BusinessBook",
};

export default function OfflinePage() {
    return <OfflineClient />;
}
