# Personal Homepage

A React.js/Zustand-based personal homepage project for personal homepage.

This project relies on [Yamd](https://github.com/wwf971/Yamd) for document rendering.


## System Architecture

```mermaid
flowchart TB
  subgraph dev ["Frontend"]
    direction LR
    App["App"] --> AssetStore["Asset store"] --> Home["Home page"]
  end

  subgraph remote ["File service"]
    direction LR
    Flask["File access API"] --> FAP["File root"] --> Disk["Storage"]
  end

  AssetStore -->|"HTTP fetch"| Flask
```

The above graph only represents current design, and architecture is being actively updated.