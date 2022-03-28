import { Action, Image, showHUD } from "@raycast/api";
import open from "open";
import { ReactElement } from "react";
import { DEVDOCS_BASE_URL } from "./constants";

export function OpenInBrowser(props: { url: string, host?: boolean, title?: string, icon?: Image.ImageLike }): ReactElement {
  const { url, host = true, title, icon } = props;
  const fullUrl = host ? `${DEVDOCS_BASE_URL}/${url}` : url;
  return (
    <Action.OpenInBrowser url={fullUrl} title={title} icon={icon} />
  );
}

export function OpenInDevdocs(props: { url: string; onOpen?: () => void }): ReactElement {
  const fullUrl = `${DEVDOCS_BASE_URL}/${props.url}`;
  return (
    <Action
      title="Open in Devdocs"
      icon="devdocs.png"
      onAction={
        async () => {
          const { exitCode } = await open(fullUrl, { app: { name: "DevDocs" }, wait: true });
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
