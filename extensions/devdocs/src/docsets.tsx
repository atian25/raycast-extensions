
import { Action, ActionPanel, Icon, List, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { useInstalledDocsets } from "./hooks";
import { faviconUrl } from "./utils";
import { Doc } from "./types";
import { fetchData } from "./utils";
import { OpenInDevdocs, OpenInBrowser } from "./actions";

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
  const icon = links?.home ? faviconUrl(64, links.home) : Icon.Document;
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
            <OpenInBrowser url={slug} />
            <OpenInDevdocs url={slug} />
            {links?.home ? (
              <OpenInBrowser title="Open Project Homepage" url={links.home} host={false} />
            ) : null}
            {links?.code ? (
              <OpenInBrowser title="Open Code Repository" url={links.code} host={false} />
            ) : null}
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}
