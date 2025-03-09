# Components

```
- WorkingPage
  ? CasesTableContainer
    | *casesData
    - CasesTable
      | 
      - CasesRow
        | #filteredCasesData (Every 20 cases 1 page, query)
        | EditButton -> *casesData
        | DeleteButton -> *casesData
    - CasesToolbar
      - AddingCaseModal
      | SelectMenu -> *queryField
      | TextInput -> *queryText
      | RefreshButton -> axios -> casesData
    - CasesPagination
  : CluesTableContainer
```