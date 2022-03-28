import { ActionPanel, List } from "@raycast/api";
import { OpenInDevdocs, OpenInBrowser } from "./actions";
import { DEVDOCS_BASE_URL } from "./constants";
import { useInstalledDocsets, useEntryList, useSearchResult } from "./hooks";
import { Doc, EntryDetail } from "./types";

export default function EntryList(): JSX.Element {
  const [installedDocsets] = useInstalledDocsets();
  const [list, isLoading] = useEntryList(installedDocsets);
  const [results, filterFn] = useSearchResult(list);

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

function EntryItem(props: { entry: EntryDetail; }) {
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
          <OpenInBrowser url={`${doc.slug}/${entry.path}`} />
          <OpenInDevdocs url={`${entry.doc.slug}/${entry.path}`} />
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
