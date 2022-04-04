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
  if (json.flags) {
    Object.entries(json.flags).forEach(([flag, value]) => {
      try {
        if (value == undefined || Object.keys(value).length === 0)
          delete json.flags[flag];
      }
      catch (err) {
        console.error(err, { value });
      }
    });
    if (Object.keys(json.flags).length === 0) delete json.flags;
  }

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
    if (data.flags.boolean) {
      if ((Array.isArray(data.flags.boolean) && data.flags.boolean.length == 0) || Object.keys(data.flags.boolean).length == 0)
        delete data.flags.boolean;
    }
    if (data.flags.dictionary) {
      if ((Array.isArray(data.flags.dictionary) && data.flags.dictionary.length == 0) || Object.keys(data.flags.dictionary).length == 0)
        delete data.flags.dictionary;
    }
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

  if (data.contextNotes?.length === 0)
    delete data.contextNotes;

  if (data.conditionals?.length === 0)
    delete data.conditionals;

  if (data.useCustomTag === false)
    delete data.useCustomTag;

  if (data.tag?.length === 0)
    delete data.tag;

  if (data.showInQuickbar === false)
    delete data.showInQuickbar;

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

  if (data.disabled === false)
    delete data.disabled;
}

function pruneAction(json) {
  const data = json.data;

  if (data.actionType?.length === 0)
    delete data.actionType;

  if (data.effectNotes?.length === 0)
    delete data.effectNotes;

  if (data.spellFailure !== undefined) {
    // Spell failure is supposed to be a number
    data.spellFailure = Number(data.spellFailure);

    if (data.spellFailure === 0)
      delete data.spellFailure;
  }

  if (data.uses?.per === null) {
    delete data.uses.max;
    delete data.uses.maxFormula;
    delete data.uses.value;
    delete data.uses.per;
  }

  if (data.target) {
    if (data.target.value?.length === 0)
      delete data.target.value;
    if (Object.keys(data.target).length === 0)
      delete data.target;
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
function pruneAttackLike(json) {
  const data = json.data;

  if (data.ability) {
    if (data.ability.attack === null)
      delete data.ability.attack;
    if (data.ability.damage === null)
      delete data.ability.damage;
    if (data.ability.critRange === 20)
      delete data.ability.critRange;
  }

  if (data.attackName?.length === 0)
    delete data.attackName;
  if (data.attackBonus?.length === 0)
    delete data.attackBonus;
  if (data.critConfirmBonus?.length === 0)
    delete data.critConfirmBonus;

  if (data.attackParts?.length === 0)
    delete data.attackParts;

  if (data.attackNotes?.length === 0)
    delete data.attackNotes;

  if (data.attack) {
    if (data.attack.parts?.length === 0)
      delete data.attack.parts;
  }

  if (data.enh == null)
    delete data.enh;

  const fmAtk = data.formulaicAttacks;
  if (fmAtk) {
    if (fmAtk.count?.formula?.length === 0)
      delete fmAtk.count;
    if (fmAtk.bonus?.formula?.length === 0)
      delete fmAtk.bonus;
    if (fmAtk.label?.length === 0 || fmAtk.label === null)
      delete fmAtk.label;

    if (Object.keys(fmAtk).length === 0)
      delete data.formulaicAttacks;
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

function pruneFeature(json) {
  const data = json.data;

  if (data.abilityType === "none" || data.abilityType == null)
    delete data.abilityType;
}

function pruneEquipment(json) {
  const data = json.data;

  if (data.equipmentType !== 'misc')
    delete data.slot;
}

function pruneAttack(json) {
  const data = json.data;

  if (data.primaryAttack === true || data.attackType !== 'natural')
    delete data.primaryAttack;
}

// Delete data that hasn't been used in a long long time by the system
function deleteOldItemDataCruft(json) {
  const data = json.data;

  if (data.recharge)
    delete data.recharge;
  if (data.damageType)
    delete data.damageType;
  if (data.formula?.length === 0)
    delete data.formula;
  if (data.time)
    delete data.time;
}

function pruneItem(json) {
  pruneCorePF1(json);
  pruneAttackLike(json);
  pruneAction(json);
  pruneRange(json);
  pruneTemplate(json);

  switch (json.type) {
    case 'feat':
      pruneFeature(json);
      break;
    case 'equipment':
      pruneEquipment(json);
      break;
    case 'attack':
      pruneAttack(json);
  }

  deleteOldItemDataCruft(json);
}

function pruneActor(json) {
  if (json.items?.length === 0)
    delete json.items;
}

export default function pruneDocument(json, options) {
  pruneCoreFoundry(json, options);

  const type = options.type;

  // WARNING: The tooling does not distinguish pack document types, so the following is a bit risky.
  // Following checks are to minimize errors, but they're not foolproof.

  // Journals, untyped documents, etc. should not be processed farther.
  if (!type || !json.data || !json.type) return;

  switch (type) {
    case 'Actor': return pruneActor(json, options);
    case 'Item': return pruneItem(json, options);
  }
}
