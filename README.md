# Meet Context Buddy.

## The friend from work you never knew you needed. 

That is, until you joined a project with thirty years of legacy code. 
Or had your team leader suddenly leave you with little organisation skills and no knowledge of what should you do next. 
Or had to collaborate with another group, full of people with different opinions on what constitutes a good code.
In case of any of these apocalyptic events, remember Context Buddy is here for you.

## Installation

Intellij plugin can be downloaded [here.](https://wip-repos.s3.eu-central-1.amazonaws.com/context-buddy-0.2.0-M88.zip)
Later on plugin can be installed in Intellij by File -> Settings -> Plugins -> gear icon -> Install Plugin from disk

![Generate Data](imgs/install.gif)


We are on our way to Intellij Plugin Repository.

## How To Use (With Examples)

Context Buddy's Smart history behaves similarly to git blame. In order to turn it on you can either right-click on left border of editor or use quick action 'Smart History'.

![Generating history](imgs/showing_history.gif)


Context buddy generates history on the fly and cache it in memory. Processing history in more detalis is more expensive then just using `git blame` so it may take few seconds to compute it (of course it happens asychronously).

![Generating history](imgs/loading_history.gif)

Conext buddy comes with dedicated view where you can inspect history in more details. You can take a look at list of commits that provide meaningful changes to the file (keep in mind that e.g. rename or reformat commits will be ommited). 

To see all changes in a file caused by a specific commit, you can either:

- hover over one of the commit's lines, until you see a tooltip, and click on the commit hash
- or choose one of the commits from Smart History's toggle

In any case, the commit of your choice should change its highlight to a fashionable red, and gain a small line mark 
on the scrollbar.


To unmark the commit, click on Smart History's "Clear selection" button. To change the data provider, choose it from the toggle list
(that might prove to be more useful later; so far, Context Buddy should only support parsing and highlighting tokens).

![Generating history](imgs/selecting_commit.gif)

Currently, Context Buddy supports data sources written in **Java, Scala, Javascript, Typescript** and **Python**. We support **YAML** and **JSON** files. 
But don't worry. More is coming.

## Future plans

We are really close to be ready to work with yours CI to generate and store semantic history of you projects (symbols, origins, etc.). Stay tuned since release is comming :)

## Tell Us What You Think

Drop us an email at `contextbuddy@virtuslab.com`. We are looking for any feedback.