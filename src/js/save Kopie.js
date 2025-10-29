


 import { InnerBlocks } from "@wordpress/block-editor";

 export default function save() {
   // Speichert die verschachtelten Blöcke im Post-Inhalt,
   // damit sie in render.php als $content ankommen.
   return <InnerBlocks.Content />;
 }