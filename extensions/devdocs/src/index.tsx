import { Action, ActionPanel, Icon, Image, List, popToRoot, showToast, Toast } from "@raycast/api";
import { ReactElement, useEffect, useState } from "react";
import { DEVDOCS_BASE_URL } from "./constants";
import { useInstalledDocsets } from "./hooks";
import { Doc, Entry } from "./types";
import { faviconUrl, fetchData } from "./utils";

interface EntryWithDoc extends Entry {
  doc: Doc;
  icon: Image.ImageLike;
}

export default function EntryList(): JSX.Element {
  const [installedDocsets] = useInstalledDocsets();
  const [list, setList] = useState<EntryWithDoc[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    async function fetchEntryList() {
      setIsLoading(true);
      try {
        const result = await Promise.all(installedDocsets.map(async doc => {
          const data = await fetchData<{ entries: EntryWithDoc[] }>(`docs/${doc.slug}/index.json`);
          data.entries.forEach(entry => {
            entry.doc = doc;
            entry.icon = doc.links?.home ? faviconUrl(64, doc.links.home) : Icon.Dot;
            entry.path = entry.path?.replace(/"/g, '');
          });
          return data.entries;
        }));
        setList(result.flat());
      } catch (error) {
        console.error(error);
        showToast(Toast.Style.Failure, "Could not refresh cache!", "Please Check your connexion");
      } finally {
        setIsLoading(false);
      }
    }
    fetchEntryList();
  }, [installedDocsets]);

  return (
    <List isLoading={isLoading} >
      {
        // searchText === '' ?
        //   <List.EmptyView title="Type something to get started" />
        //   :
        list?.map(entry => (<EntryItem entry={entry} />))
      }
    </List>
  );
};

function EntryItem(props: { entry: EntryWithDoc; }) {
  const { entry } = props;
  return <List.Item
    title={entry.name}
    subtitle={`${DEVDOCS_BASE_URL}/${entry.doc.slug}/${entry.path}`}
    icon={entry.icon}
    key={entry.name + entry.path}
    accessoryTitle={entry.type}
    keywords={[entry.type].concat(entry.name.split("."))}
    actions={
      <ActionPanel>
        <Action.OpenInBrowser url={`${DEVDOCS_BASE_URL}/${entry.doc.slug}/${entry.path}`} onOpen={() => popToRoot()} />
        {/* <OpenInDevdocsAction url={`${DEVDOCS_BASE_URL}/${entry.doc.slug}/${entry.path}`} onOpen={() => popToRoot()} /> */}
      </ActionPanel>
    }
  />
}
