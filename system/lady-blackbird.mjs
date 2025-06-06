// Import document classes.
import { LadyBlackbirdActor } from "./src/documents/actor.mjs";
import { LadyBlackbirdItem } from "./src/documents/item.mjs";
// Import sheet classes.
import { LadyBlackbirdActorSheet } from "./src/sheets/actor-sheet.mjs";
import { LadyBlackbirdItemSheet } from "./src/sheets/item-sheet.mjs";
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./src/helpers/templates.mjs";
import { LADY_BLACKBIRD } from "./src/helpers/config.mjs";
// Import DataModel classes
import * as models from "./src/data/_module.mjs";

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

  // Define custom Document and DataModel classes
  CONFIG.Actor.documentClass = LadyBlackbirdActor;
  CONFIG.Item.documentClass = LadyBlackbirdItem;

  // Note that you don't need to declare a DataModel
  // for the base actor/item classes - they are included
  // with the Character/NPC as part of super.defineSchema()
  CONFIG.Actor.dataModels = {
    character: models.LadyBlackbirdCharacter,
  };
  CONFIG.Item.dataModels = {
    trait: models.LadyBlackbirdTrait,
  };

  // Register sheet application classes
  foundry.documents.collections.Actors.unregisterSheet(
    "core",
    foundry.applications.sheets.ActorSheetV2,
  );
  foundry.documents.collections.Actors.registerSheet(
    "lady-blackbird",
    LadyBlackbirdActorSheet,
    {
      makeDefault: true,
      label: "LADY_BLACKBIRD.SheetLabels.Actor",
    },
  );

  foundry.documents.collections.Items.unregisterSheet(
    "core",
    foundry.applications.sheets.ItemSheetV2,
  );
  foundry.documents.collections.Items.registerSheet(
    "lady-blackbird",
    LadyBlackbirdItemSheet,
    {
      makeDefault: true,
      label: "LADY_BLACKBIRD.SheetLabels.Item",
    },
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

Handlebars.registerHelper("times", function (n, block) {
  let accum = "";
  for (let i = 0; i < n; ++i) {
    accum += block.fn(i);
  }
  return accum;
});

Handlebars.registerHelper(
  "ifTagSelected",
  function (name, group, power, array, options) {
    if (!Array.isArray(array)) return options.inverse(this);

    const exists = array.some(
      (el) =>
        el.name === name && el.group === group && el.power === power.toString(),
    );

    return exists ? options.fn(this) : options.inverse(this);
  },
);

Handlebars.registerHelper("let", function (options) {
  const data = options.data ? Handlebars.createFrame(options.data) : {};
  const context = {};

  for (const [key, value] of Object.entries(options.hash)) {
    context[key] = value;
  }

  return options.fn(context, { data });
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", function () {});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */
