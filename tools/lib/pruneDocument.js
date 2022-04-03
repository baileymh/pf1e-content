// Remove data that is not needed to be present.

/**
 * Remove unnecessary core Foundry data.
 */
function pruneCoreFoundry(json) {
  // Sorting position
  delete json.sort;
  // Active effects
  if (json.effects?.length === 0) delete json.effects;
  // Flags
  if (json.flags && Object.keys(json.flags).length === 0) delete json.flags;
  // Folder
  if (json.folder?.length === 0 || json.folder == null) delete json.folder;
  // User permissions
  delete json.permission;
}

// Handle PF1 data present in most item types
function pruneCorePF1(json) {
  const data = json.data;

  // Boolean & Dictionary flags
  if (data.flags) {
    // Deal with both arrays and objects. Arrays are no longer supported, however.
    if ((Array.isArray(data.flags.boolean) && data.flags.boolean.length == 0) || Object.keys(data.flags.boolean).length == 0)
      delete data.flags.boolean;
    if ((Array.isArray(data.flags.dictionary) && data.flags.dictionary.length == 0) || Object.keys(data.flags.dictionary).length == 0)
      delete data.flags.dictionary;
  }

  // Script calls
  if (data.scriptCalls?.length === 0) delete data.scriptCalls;

  // Associations
  if (data.associations) {
    // Remove empty values
    if (data.associations.classes)
      data.associations.classes = data.associations.classes.filter(i => i?.length > 0);

    // No class associations left
    if (data.associations.classes?.length === 0)
      delete data.associations.classes;

    // No associations left at all
    if (Object.keys(data.associations).length == 0)
      delete data.associations;
  }

  // Links
  if (data.links) {
    if (data.links.charges?.length === 0)
      delete data.links.charges;
    if (data.links.children?.length === 0)
      delete data.links.children;

    // No links left
    if (Object.keys(data.links).length === 0)
      delete data.links;
  }

  // Changes
  if (data.changes?.length === 0)
    delete data.changes;

  // Change flags
  if (data.changeFlags) {
    // Remove change flags that are not in effect
    Object.entries(data.changeFlags).forEach(([flag, value]) => {
      if (value === false) delete data.changeFlags[flag];
    });

    // No change flags left?
    if (Object.keys(data.changeFlags).length === 0)
      delete data.changeFlags;
  }

  // Clear empty armor proficiencies
  if (data.armorProf) {
    if (data.armorProf.custom?.length === 0)
      delete data.armorProf.custom;
    if (data.armorProf.value?.length === 0)
      delete data.armorProf.value;
    if (Object.keys(data.armorProf).length === 0)
      delete data.armorProf;
  }

  // Clear empty weapon proficiencies
  if (data.weaponProf) {
    if (data.weaponProf.custom?.length === 0)
      delete data.weaponProf.custom;
    if (data.weaponProf.value?.length === 0)
      delete data.weaponProf.value;
    if (Object.keys(data.weaponProf).length === 0)
      delete data.weaponProf;
  }

  // CR offset
  if (data.crOffset?.length === 0)
    delete data.crOffset;

  // Sound effect
  if (data.soundEffect?.length === 0)
    delete data.soundEffect;
}

function pruneAction(json) {
  const data = json.data;

  if (data.actionType?.length === 0)
    delete data.actionType;

  if (data.effectNotes?.length === 0)
    delete data.effectNotes;

  if (data.uses?.per === null) {
    delete data.uses.max;
    delete data.uses.maxFormula;
    delete data.uses.value;
  }

  if (data.save) {
    if (data.save.description?.length === 0)
      delete data.save.description;
    if (data.save.dc === 0 && json.type !== 'spell')
      delete data.save;
  }

}

function pruneRange(json) {
  const data = json.data;

  const rangeType = data.range?.value;
  if (rangeType?.length === 0 || rangeType === null)
    delete data.range;
}

// Handle attack related data if present.
function pruneAttack(json) {
  const data = json.data;

  if (data.ability?.attack === null)
    delete data.ability.attack;
  if (data.ability?.damage === null)
    delete data.ability.damage;

  if (data.attackName?.length === 0)
    delete data.attackName;
  if (data.attackBonus?.length === 0)
    delete data.attackBonus;

  if (data.attackParts?.length === 0)
    delete data.attackParts;

  if (data.attackNotes?.length === 0)
    delete data.attackNotes;

  if (data.attack) {
    if (data.attack.parts?.length === 0)
      delete data.attack.parts;
  }

  if (data.damage) {
    if (data.damage.parts?.length === 0)
      delete data.damage.parts;
    if (data.damage.critParts?.length === 0)
      delete data.damage.critParts;
    if (data.damage.nonCritParts?.length === 0)
      delete data.damage.nonCritParts;

    if (Object.keys(data.damage).length === 0)
      delete data.damage;
  }

  if (data.nonlethal === false)
    delete data.nonlethal;
}

function pruneTemplate(json) {
  const data = json.data;

  const mtpl = data.measureTemplate;
  if (mtpl) {
    if (mtpl.customColor?.length === 0)
      delete mtpl.customColor;
    if (mtpl.customTexture?.length === 0)
      delete mtpl.customTexture;
    if (mtpl.size?.length === 0)
      delete mtpl.size;
    if (mtpl.type?.length === 0)
      delete mtpl.type;
    if (mtpl.overrideColor === false)
      delete mtpl.overrideColor;
    if (mtpl.overrideTexture === false)
      delete mtpl.overrideTexture;

    if (Object.keys(mtpl).length === 0)
      delete data.measureTemplate;
  }
}


function pruneItem(json) {
  pruneCorePF1(json);
  pruneAttack(json);
  pruneAction(json);
  pruneRange(json);
  pruneTemplate(json);
}

function pruneActor(json) {
  if (json.items?.length === 0)
    delete json.items;
}

export default function pruneDocument(json) {
  pruneCoreFoundry(json);

  // WARNING: The tooling does not distinguish document types, so the following is a bit risky.

  if (!json.data) return; // Journal or such
  if (!json.type) return; // Untyped documents

  if (['character', 'npc'].includes(json.type))
    pruneActor(json);
  else if (['buff', 'spell', 'loot', 'attack', 'weapon', 'feat', 'equipment', 'race', 'class'].includes(json.type))
    pruneItem(json);
  else
    console.warn("Unrecognized type:", json.type);
}
