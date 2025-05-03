// Import document classes.
import { LadyBlackbirdActor } from "./documents/actor.mjs";
import { LadyBlackbirdItem } from "./documents/item.mjs";
// Import sheet classes.
import { LadyBlackbirdActorSheet } from "./sheets/actor-sheet.mjs";
import { LadyBlackbirdItemSheet } from "./sheets/item-sheet.mjs";
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { LADY_BLACKBIRD } from "./helpers/config.mjs";
// Import DataModel classes
import * as models from "./data/_module.mjs";

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once("init", function () {
  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.ladyblackbird = {
    LadyBlackbirdActor,
    LadyBlackbirdItem,
  };

  // Add custom constants for configuration.
  CONFIG.LADY_BLACKBIRD = LADY_BLACKBIRD;

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20 + @abilities.dex.mod",
    decimals: 2,
  };

  // Define custom Document and DataModel classes
  CONFIG.Actor.documentClass = LadyBlackbirdActor;

  // Note that you don't need to declare a DataModel
  // for the base actor/item classes - they are included
  // with the Character/NPC as part of super.defineSchema()
  CONFIG.Actor.dataModels = {
    character: models.LadyBlackbirdCharacter,
  };
  CONFIG.Item.documentClass = LadyBlackbirdItem;
  CONFIG.Item.dataModels = {
    item: models.LadyBlackbirdItem,
    feature: models.LadyBlackbirdFeature,
    spell: models.LadyBlackbirdSpell,
  };

  // Active Effects are never copied to the Actor,
  // but will still apply to the Actor from within the Item
  // if the transfer property on the Active Effect is true.
  CONFIG.ActiveEffect.legacyTransferral = false;

  // Register sheet application classes
  foundry.documents.collections.Actors.unregisterSheet(
    "core",
    foundry.applications.sheets.ActorSheetV2
  );
  foundry.documents.collections.Actors.registerSheet(
    "lady-blackbird",
    LadyBlackbirdActorSheet,
    {
      makeDefault: true,
      label: "LADY_BLACKBIRD.SheetLabels.Actor",
    }
  );
  foundry.documents.collections.Items.unregisterSheet(
    "core",
    foundry.applications.sheets.ItemSheetV2
  );
  foundry.documents.collections.Items.registerSheet(
    "lady-blackbird",
    LadyBlackbirdItemSheet,
    {
      makeDefault: true,
      label: "LADY_BLACKBIRD.SheetLabels.Item",
    }
  );

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here is a useful example:
Handlebars.registerHelper("toLowerCase", function (str) {
  return str.toLowerCase();
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", function () {});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */
