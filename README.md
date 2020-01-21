# Pull request info action

Put following code in .github/workflows/main.yml

```
on:
  pull_request:
    types: [closed]

jobs:
  pr_info_action_job:
    runs-on: ubuntu-latest
    name: A job to save PR review comments
    steps:
    - name: Save PR comments in .storage
      id: sample
      uses: VirtusLab/contextbuddy@gh-actions
      with:
        repo-token: ${{ secrets.GITHUB_TOKEN }}
```

