# How to Contribute

> :warning: **Let's Contribute is shutting down**: New content should not be submitted with it!

With Let's Contribute shutting down, with the help of @Zarek#4201, we've revamped how the files and managed, and therefore how you are able to contribute.

## Contribute via PR

Contributions via github pull request follow a standard github workflow. You will fork the repository, add/modify the items with the help of a script, and submit your pull request for review. The [Github Docs](https://docs.github.com/en/get-started/quickstart/github-flow) page has an overview of the workflow if you aren't familiar with it.

### Set up NodeJS and npm

To make merging your item changes with the existing as easy as possible a JavaScript tool is provided. To use this you'll need a runtime like [NodeJS](https://nodejs.org/en/). Installing NodeJS will vary by platform but is well documented by the project. When properly installed you should be able to run `npm --version` and `node --version` to verify your install is working.

### Create a fork of PF-Content

When viewing this repository [on github]() there is a button in the top right to fork the repo. You can also read the official [Github Docs](https://docs.github.com/en/get-started/quickstart/fork-a-repo#forking-a-repository) if you need help.

### Clone your fork of the repository

After creating your fork clone the repository following [GitHub Documentation](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository#about-cloning-a-repository). When you are done you should have a local copy of the repository you can add your files to.

### Create a feature branch

You can create a branch with git from the command line with `git checkout -b my-awesome-branch` If you are new to git the [Github Documentation on Branches](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-and-deleting-branches-within-your-repository) can help.

### Exporting your edits

Now that you have a branch you are ready to add your new or updated items. You'll need to export each of the items you want to contribute from FoundryVTT. You can export items from the [Items](https://foundryvtt.com/article/items/) tab in foundry, by right clicking on the item and selecting "export". You can drag items from your inventory to the items directory as long as you have the "create items" permissions.

#### Getting items ready

When you're contributing items to the module they need to be setup appropriately for generic use by others.

* Only use icons provided by foundry, this module, or pf1e system
* Don't use external links in descriptions or notes
* Take a minute to fill in price, hardness, weight and other values if applicable
* Prefer descriptions from [aon](https://aonprd.com/) when available for consistency

### Merging with the module

For each json file that you exported place it into a folder based on the compendium you wish to contribute to. All of your additions go into a folder named `additions/<compendium-name>`. For example, to add an item to the `pf-items` compendium place the json file for that item into the folder `additions/pf-items/my-updated-item.json`. In your local copy of your branch of this repository.

Run the merge script which will add or update your items with the command:

`npm run merge`

The merge tool will process each of the files and add or update their entries in the folders in `src/packs`. At this point running `git diff` should display your changes in their databases for you to commit and propose for review. The `additions` folder should never be checked into git and is included in `.gitignore`. You should keep your json item files around until the merge is accepted, if you need to rebase your changes you can simply check out the `main` branch and re-run the merge to re-add your items to the latest copy of the database.

If you're new to adding and pushing changes [Githubs documenation](https://docs.github.com/en/get-started/quickstart/contributing-to-projects#making-and-pushing-changes) is a good start.

## Merge details

The merge script should generally *do the right thing* but there are some edge cases where it might need some help.

* If there are multiple items that already exist with the same name as the one you are trying to add or modify the script will prompt you to choose which file you are trying to update.
* Adding a new item which matches the name of an existing item is not currently supported, if you have a good use case for that please ask on discord
* Items are never deleted, only created or updated. To delete an item remove it's file from the src pack folder.
* Renaming an item requires a bit of extra care to avoid simply creating a new item with a new name.

### Item renaming

Every item in the database has a unique id field `_id` at the top level of the json structure. When new items are inserted a new `_id` is generated, if you want to keep the original entries id so that existing games using the item get the updates rather than a new item you need to preserve this ID.

Items exported from FoundryVTT don't have an `_id` field because they are assigned by the database (compendium). The merge script therefore will search for items to update based on the item name. The script will search by the more specific an unique `_id` field if it is present. This means you can manually add the `_id` field of the item you are trying to rename and the merge script will update and create a new item preserving the ID. Because the script never deletes items after you confirm your new item was created you must delete the file with the old name to avoid having two items with the same ID. If you do not do this the release process will fail until one of the two items are removed. In summary you should:

* Manually add the `_id` field from the existing item from `src/packs/<pack-name>/original-item.json` to your file in `additions/<pack-name>/my-update.json`.
* Run the merge script and verify a new file was created with your new name but the same `_id` as before
* Remove the original file from the `src` folder to avoid duplicate item ids.
