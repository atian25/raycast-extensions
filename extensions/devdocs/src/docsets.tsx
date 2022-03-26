
import { DEVDOCS_BASE_URL } from "./constants";
import { useFetchWithCache, useDocsets } from "./hooks";
import { faviconUrl } from "./utils";
import { Doc } from "./types";
import { Action, ActionPanel, Icon, List, popToRoot } from "@raycast/api";
import { useState } from "react";


export default function DocList(): JSX.Element {
  const { data, isLoading } = useFetchWithCache<Doc[]>(`${DEVDOCS_BASE_URL}/docs/docs.json`, "index.json");
  const [docsets, toggleDocset] = useDocsets();

  const list = data?.map(doc => {
    doc.enabled = docsets.includes(doc.slug);
    return doc;
  }).sort(a => a.enabled ? -1 : 1);

  return (
    <List isLoading={(!data && !data) || isLoading} >
      {list?.map((doc) => (
        <DocItem key={doc.slug} doc={doc} isEnabled={docsets.indexOf(doc.slug) !== -1} onEnter={() => toggleDocset(doc)} />
      ))}
    </List>
  );
}

function DocItem(props: { doc: Doc; isEnabled: boolean, onEnter: () => void }) {
  const { doc, isEnabled, onEnter } = props;
  const { name, slug, links, version, release, enabled } = doc;
  const icon = links?.home ? faviconUrl(64, links.home) : Icon.Dot;
  return (
    <List.Item
      key={slug}
      title={`${name}`}
      icon={icon}
      subtitle={`${version}`}
      keywords={[release]}
      // accessoryTitle={release}
      accessoryTitle={`${enabled ? '✅' : ''} ${release}`}
      actions={
        <ActionPanel>
          <ActionPanel.Section>
            <Action title={isEnabled ? "Uninstall Docset" : "install Docset"} onAction={onEnter} />
            {/* <PushAction
              title="Browse Entries"
              icon={Icon.ArrowRight}
              target={<EntryList doc={doc} icon={icon} />}
              onPush={onEnter}
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
