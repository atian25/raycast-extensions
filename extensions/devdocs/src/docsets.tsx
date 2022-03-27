
import { Action, ActionPanel, Icon, List, popToRoot, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { DEVDOCS_BASE_URL } from "./constants";
import { useInstalledDocsets } from "./hooks";
import { faviconUrl } from "./utils";
import { Doc } from "./types";
import { fetchData } from "./utils";

export default function DocList(): JSX.Element {
  const [docsets, setDocsets] = useState<Doc[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [installedDocsets, toggleDocset] = useInstalledDocsets();

  useEffect(() => {
    async function fetchDocsets() {
      setIsLoading(true);
      try {
        const data = await fetchData<Doc[]>('docs/docs.json');
        const installed = installedDocsets.map(doc => doc.slug);
        data.forEach(doc => { doc.enabled = installed.includes(doc.slug) });
        setDocsets(data);
      } catch (error) {
        console.error(error);
        showToast(Toast.Style.Failure, "Could not refresh cache!", "Please Check your connection.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchDocsets();
  }, []);

  return (
    <List isLoading={isLoading} >
      <List.Section title="Installed Docsets">
        {installedDocsets.map((doc) => (
          <DocItem key={doc.slug} doc={doc} onAction={() => toggleDocset(doc)} />
        ))}
      </List.Section>

      <List.Section title="Available Docsets">
        {docsets?.map((doc) => (
          <DocItem key={doc.slug} doc={doc} onAction={() => toggleDocset(doc)} />
        ))}
      </List.Section>
    </List>
  );
}

function DocItem(props: { doc: Doc; onAction: () => void }) {
  const { doc, onAction } = props;
  const { name, slug, links, version, release, enabled } = doc;
  const icon = links?.home ? faviconUrl(64, links.home) : Icon.Dot;
  return (
    <List.Item
      key={slug}
      title={name}
      icon={icon}
      subtitle={version}
      keywords={[release]}
      accessoryTitle={release}
      actions={
        <ActionPanel>
          <ActionPanel.Section>
            <Action title={enabled ? "Uninstall Docset" : "Install Docset"} onAction={onAction} />
          </ActionPanel.Section>
          <ActionPanel.Section>
            <Action.OpenInBrowser url={`${DEVDOCS_BASE_URL}/${slug}`} onOpen={() => popToRoot()} />
            {/* <OpenInDevdocsAction url={`${DEVDOCS_BASE_URL}/${slug}`} onOpen={() => popToRoot()} /> */}
            {links?.home ? (
              <Action.OpenInBrowser title="Open Project Homepage" url={links.home} onOpen={() => popToRoot()} />
            ) : null}
            {links?.code ? (
              <Action.OpenInBrowser title="Open Code Repository" url={links.code} onOpen={() => popToRoot()} />
            ) : null}
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}
