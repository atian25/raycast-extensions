
import { DEVDOCS_BASE_URL } from "./constants";
import { useFetchWithCache, useDocsets } from "./hooks";
import { faviconUrl } from "./utils";
import { Doc } from "./types";
import { Action, ActionPanel, Icon, List, popToRoot } from "@raycast/api";


export default function DocList(): JSX.Element {
  const { data, isLoading } = useFetchWithCache<Doc[]>(`${DEVDOCS_BASE_URL}/docs/docs.json`, "index.json");
  const [docsets, toggleDocset] = useDocsets();

  const list = data?.map(doc => {
    doc.enabled = docsets.includes(doc.slug);
    return doc;
  });

  return (
    <List isLoading={(!data && !data) || isLoading} >
      <List.Section title="Installed Docsets">
        {list?.filter(x => x.enabled).map((doc) => (
          <DocItem key={doc.slug} doc={doc} onAction={() => toggleDocset(doc)} />
        ))}
      </List.Section>

      <List.Section title="Available Docsets">
        {list?.map((doc) => (
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
            {/* <PushAction
              title="Browse Entries"
              icon={Icon.ArrowRight}
              target={<EntryList doc={doc} icon={icon} />}
              onPush={onAction}
            /> */}
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
