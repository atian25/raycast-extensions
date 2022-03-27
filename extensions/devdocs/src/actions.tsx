import { Action, showHUD } from "@raycast/api";
import open from "open";
import { ReactElement } from "react";

export function OpenInDevdocsAction(props: { url: string; onOpen?: () => void }): ReactElement {
  return (
    <Action
      title="Open in Devdocs"
      icon="devdocs.png"
      onAction={async () => {
        const { exitCode } = await open(props.url, { app: { name: "DevDocs" }, wait: true });
        if (exitCode !== 0) {
          await open("https://github.com/dteoh/devdocs-macos");
          showHUD("Devdocs app is not installed!");
        }

        if (props.onOpen) {
          props.onOpen();
        }
      }
      }
    />
  );
}
