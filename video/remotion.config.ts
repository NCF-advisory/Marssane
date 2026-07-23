import { Config } from "@remotion/cli/config";

/**
 * Configuration Remotion du projet vidéo Marssane.
 * Le dossier `public/` (polices woff2) est le publicDir par défaut ; on le laisse.
 */
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(null); // auto (nombre de cœurs)
// BT.709 plage limitée (standard web). Le « default » de Remotion 4 encode en
// bt470bg pleine plage (yuvj420p), que le décodage matériel de certains PC
// Windows rend en frames blanches — vidéo visible un instant (poster) puis
// blanche sur la page d'accueil.
Config.setColorSpace("bt709");
