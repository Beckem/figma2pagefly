import { render } from "@create-figma-plugin/ui";
import { h } from "preact";
import { useEffect } from "react";
import {
  appendJsonDataToPageFlly,
  convertJsonToPageFly,
  jsonData,
} from "./figmaNode/convertJsonToPageFly";

function Plugin() {
  useEffect(() => {
    onmessage = async (event: {
      data: {
        pluginMessage: any;
      };
    }) => {
      const pluginMessage = event.data.pluginMessage;
      console.log(pluginMessage);

      if (!pluginMessage) return;

      if (pluginMessage.type === "sendSelectedNode") {
        convertJsonToPageFly(event.data.pluginMessage.nodeJSON, 1);
        console.log("testData", jsonData);
        console.log("event.data.pluginMessage", event.data.pluginMessage);
        appendJsonDataToPageFlly();
      }
    };
  }, []);
  return <div></div>;
}

export default render(Plugin);
