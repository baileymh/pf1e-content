[![Digital-Patreon-Wordmark_FieryCoral2](https://user-images.githubusercontent.com/48079051/119408916-7b145f80-bcb4-11eb-9040-5879379cfa0b.png)](https://www.patreon.com/fadedshadow589)

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/donate?hosted_button_id=E5Z634F26LEJC)

# pf1e-content

Converted/imported content for Foundry VTT PF1e

This module comprises a host of content for Pathfinder 1st ed. for Foundry.

## Included Content

- ~4,200 magic items
    Including ammo, rods, weapons, armor, artifacts, cursed items, staffs, and wondrous items

- ~2,000 non-magic items
  - Includes adventuring gear, alchemical items, animal gear, black market, clothing, books, food/drink, herbs, kits, lodging/services, mounts/pets, spellbooks, tools, transportion, and vehicles.

  - These items are split between two compendia: PF-Items and PF-Goods and Services. The PF-Goods and Services compendium contains animals/mounts/pets, along with animal gear, food/drink, herbs, lodging/services, clothing, books, spellbooks, transportion, and vehicles. While the PF-Items compendium contains the adventuring gear, alchemical items, and tool.

- Several Merchant NPCs and roll tables have been added.
  - They have the bulk of the non-magicical items listed above (I'm still adding to some of them).
  - By default, they are set as pf1 system loot sheets. If you have the Loot Sheet module, you can easily convert the sheet type and turn them into proper Merchants that players can use.

- ~3,500 feats

- 2,034 traits and 1,214 racial traits

- 4,727 Class Abilities (Arcane Discovery, Domains, Talents, etc.)

- Technology Weapons, Armor, and Items

- Occult Rituals (those on AON)

- 147 Universal Monster Rules

- 177 Familiars and Pets

- 160+ buffs/debuffs and variants

- GM Quick Reference compendium, with commonly used/confused rules for easier time GM'ing. As well as some tips for working in Foundry, and for contributing towards this and other rules/modules using Changes.

### Rule Compendium

- PF-Rules
  - Contains most of the rules for Basic Play, Combat, Environment, Exploration, Items, Magic, and Skills
  - Plans to include Optional Rules and Gamemastery content
- Kingdom Building
  - Including an organized journal sheet for the tracking and use of kingdom buildings in Foundry
  - Also includes a map and tokens for use as District Grid and Buildings.

## Information

If you notice missing items or errors, please open an issue or pm me on Discord (fadedshadow589#8270).

These compendiums are not perfect. Except for buffs, most of them do not contain all the appropriate changes to attacks, armor bonuses, etc. However, the item description and all relevant info needed to make them are should be included, and Change formulas are slowly being added with help from the community.

Before altering any of the compendium databases, it is strongly recommended you create a personal copy of each to prevent the originals from being overwritten.

3.5 feats and traits are in a separate compendium. They are enabled by default and can be manually disabled.

## Kingdom Building

The Kingdom Building Journal Entries are splint into two, GM and Player. GM contains all the information, including optional rules, while the player version contains the rules most relevant to players without the bonuses/penalties they will get for particular buildings.
Includes a sample District, Building tokens created using game-icons, along with a few terrain tokens created in photoshop. If you would like to have better art included, or have any feedback, feel free to message me on discord or submit changes through Let's Contribute!

![image](https://user-images.githubusercontent.com/48079051/113073993-31b60100-9198-11eb-86d1-290b23d77297.png) ![image](https://user-images.githubusercontent.com/48079051/113073998-337fc480-9198-11eb-9229-6ae23ff12c7b.png)
<img src="https://user-images.githubusercontent.com/48079051/113074059-55794700-9198-11eb-9764-dbd0e99df74e.png" width="478" height="506">

## Planned Features/Additions

The following represent some of the planned features I intend to impliment:
- [x] Kingdom Building Rules
- [x] Traps
- [x] Diseases
- [x] Mythic Adventure Rulebook
- [x] Horror Adventure Rulebook
- [x] Racial traits
- [x] Familiars and Companions
- [x] Haunts
- [x] Madnesses
- [x] Curses
- [x] Poisons
- [x] Deities
- [ ] Additional buffs/debuffs
- [ ] Summoned Monsters
- [ ] Occult Rituals
- [ ] GM'ing Tools and Resources
- [ ] Potential Journal packs for Occult Adventures, Planar Adventures, Ultimate ___, etc..

## Want to Help?

> :warning: **Let's Contribute is shutting down**: New content should not be submitted with it!

### Contribute via PR (WIP)
If you would like to contribute via Github PR you can export items and use a script in this repo to merge them into the appropriate compendium to submit a merge request. To use the script you will need [NodeJS](https://nodejs.org/en/) installed.

Once installed, install the package dependencies with `npm install` in the base folder. This should create the `node_modules` folder with dependencies installed.

Next you'll place your exported items into a folder structure for merging. In your instance of Foundry right click on the item in the item browser you want to add or update and click `Export Data`. This will download a json file. Repeat this for all items you want to submit in a single PR, you should separate updates into the smallest logical groups so that discussion on one update doesn't prevent acceptance of others.

For each json file that you exported place it into a folder based on the compendium you wish to contribute to. All of your additions go into a folder named `additions/<compendium-name>`. For example, to add an item to the `pf-items` compendium place the json file for that item into a folder `additions/pf-items/my-updated-item.json`.

Now run the merge script with the command `npm run merge`. The script should output a bit of logging and merge all of your files under the `additions` folder into their respective databases. A diff of each item will be logged in a format that can be directly pasted into the github pull request in a `diff` code block for easier review. At this point running `git diff` should display your changes in their databases for you to commit and propose for review. The `additions` folder should never be checked into git and is included in `.gitignore`. You should keep your json item files around until the merge is accepted, if you need to rebase your changes you can simply check out the `main` branch and re-run the merge to re-add your items to the latest copy of the database.

### Deprecated contribute via Let's Contribute
If you would like to help, you can do so through the Let's Contribute module feature for both PF-Content and PF1e Archetypes. If you have made Changes to any of the items added by this module (Changes, better icons, fixed typos, tags, grammar), you can upload those changes by clicking the icon in the top left corner. I will be regularly checking and merging changes people submit.

(Note: you don't need the Let's Contribute access key to contribute. That's for reviewers (myself).)

![image](https://user-images.githubusercontent.com/48079051/117498157-6b241e00-af47-11eb-8be1-a2b8f60f4eea.png)

![image](https://user-images.githubusercontent.com/48079051/112698919-234aab00-8e61-11eb-8930-a697082808fd.png)

**If you are only submitting Changes or Context notes, use that Initiative. If you are editing more (description, qualities, attacks, etc.) leave it with no initiative.**

Alternatively, you can open an issue if you find a missing item, or an error. If you have changed/fixed multiple items, you are welcome to either send me the updated .db file or do a pull request so that I can try to merge your changes.

Finally, individual progress of items/features is being tracked using a [Google Sheet](https://docs.google.com/spreadsheets/d/1-H3mnJI9DNEd1GXp81ky3iN0pHmYS_8MyPcC-e1hnZQ/edit?usp=sharing).

If you have any questions, concerns, or ideas, you are welcome to message me on discord (fadedshadow589#8270).

## Installation

To install through Foundry, click on the Add-on Modules tab, then the Install Module button, and search for Pathfinder 1e Content.

----------------

## Credit

These items were converted to foundry with the help of Data Toolbox for FoundryVTT by Sven Werlen, and the following excel sheets by Mike Chopswil.

Huge thank you to @TMun#1625 for providing raw data from AON.

Monster Stat blocks
<https://docs.google.com/spreadsheets/d/1PkEkEcf4UbzCb-kISnvAvOGWcuDzwvAMaVG25sD1CQc/edit#gid=534557795>

Magic Items:
<https://docs.google.com/spreadsheets/d/1NQhHjDXhvFZkMiu09epBXsVwCI6YENg-AUQhF-v5ntU/edit#gid=44940957>

## Big Thanks for Helping Contribute

Websterguy, Noon, apetina, david (aka claudekennilol), moorepants, ACorania, Chris Sanders (Zarek#4201)

Kingdom Building Rules:
The content here was converted from a module designed by dllewell for Fantasy Grounds. Primary credit for the rules conversation goes to them. I converted and edited the base text rules to be usable and compatible with Foundry VTT.

## Legal

"This system uses trademarks and/or copyrights owned by Paizo Inc., which are used under Paizo's Community Use Policy. We are expressly prohibited from charging you to use or access this content. This [website, character sheet, or whatever it is] is not published, endorsed, or specifically approved by Paizo Inc. For more information about Paizo's Community Use Policy, please visit paizo.com/communityuse. For more information about Paizo Inc. and Paizo products, please visit paizo.com."

