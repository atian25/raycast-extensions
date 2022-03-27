import { Action, ActionPanel, Icon, Image, List, popToRoot, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { OpenInDevdocsAction } from "./actions";
import { DEVDOCS_BASE_URL } from "./constants";
import { useInstalledDocsets, useFuse } from "./hooks";
import { Doc, Entry } from "./types";
import { faviconUrl, fetchData } from "./utils";

interface EntryWithDoc extends Entry {
  doc: Doc;
  icon: Image.ImageLike;
}

interface QueryOptions {
  str?: string;
  slug?: string;
}

export default function EntryList(): JSX.Element {
  const [installedDocsets] = useInstalledDocsets();
  const [list, setList] = useState<EntryWithDoc[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [queryOptions, setQueryOptions] = useState<QueryOptions>({});
  const [results, search] = useFuse(list, { keys: ["name", "type", "doc.slug"] }, 500);

  function filterFn(q: QueryOptions) {
    const opts = { ...queryOptions, ...q };
    setQueryOptions(opts);

    const query: Record<string, unknown>[] = [];

    if (opts.slug) {
      query.push({
        $path: "doc.slug",
        $val: opts.slug,
      });
    }

    if (opts.str) {
      query.push({
        $or: [
          { name: opts.str },
          { type: opts.str }
        ]
      });
    }

    search(query.length ? { $and: query } : '');
  }

  useEffect(() => {
    async function fetchEntryList() {
      setIsLoading(true);
      try {
        const apis = await Promise.all(installedDocsets.map(async doc => {
          const data = await fetchData<{ entries: EntryWithDoc[] }>(`docs/${doc.slug}/index.json`);
          data.entries.forEach(entry => {
            entry.doc = doc;
            entry.icon = doc.links?.home ? faviconUrl(64, doc.links.home) : Icon.Dot;
            entry.path = entry.path?.replace(/"/g, '');
          });
          return data.entries;
        }));

        setList(apis.flat());
      } catch (error) {
        console.error(error);
        showToast(Toast.Style.Failure, "Could not refresh cache!", "Please Check your connection");
      } finally {
        setIsLoading(false);
      }
    }
    fetchEntryList();
  }, [installedDocsets]);

  return (
    <List
      isLoading={isLoading}
      enableFiltering={false}
      onSearchTextChange={str => filterFn({ str })}
      searchBarAccessory={
        <DocFilterDropDown
          docs={installedDocsets}
          onChange={slug => filterFn({ slug })}
        />
      }
    >
      {
        results?.map(entry => (
          <EntryItem entry={entry} key={entry.doc.slug + entry.name + entry.path} />
        ))
      }
    </List>
  );
};

function EntryItem(props: { entry: EntryWithDoc; }) {
  const { entry, entry: { doc } } = props;
  return (
    <List.Item
      title={entry.name}
      subtitle={`${DEVDOCS_BASE_URL}/${doc.slug}/${entry.path}`}
      icon={entry.icon}
      key={doc.slug + entry.name + entry.path}
      accessories={[
        // { text: doc.name },
        // { icon: Icon.Person },
        { text: entry.type },
      ]}
      keywords={[entry.type].concat(entry.name.split("."))}
      actions={
        <ActionPanel>
          <Action.OpenInBrowser url={`${DEVDOCS_BASE_URL}/${doc.slug}/${entry.path}`} onOpen={() => popToRoot()} />
          <OpenInDevdocsAction url={`${DEVDOCS_BASE_URL}/${entry.doc.slug}/${entry.path}`} onOpen={() => popToRoot()} />
        </ActionPanel>
      }
    />
  );
}

function DocFilterDropDown({ docs, onChange }: { docs: Doc[]; onChange: (v: string) => void }) {
  return (
    <List.Dropdown tooltip="Filter by docset" storeValue={true} onChange={onChange} >
      <List.Dropdown.Item key="" title="All Docsets" value="" />
      {docs?.map(doc => (
        <List.Dropdown.Item
          key={doc.slug}
          title={`${doc.name} ${doc.version || ''}`}
          value={doc.slug}
        />
      ))}
    </List.Dropdown>
  );
}
