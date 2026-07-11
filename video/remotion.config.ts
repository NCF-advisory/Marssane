import { Config } from "@remotion/cli/config";

/**
 * Configuration Remotion du projet vidéo Marssane.
 * Le dossier `public/` (polices woff2) est le publicDir par défaut ; on le laisse.
 */
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(null); // auto (nombre de cœurs)
