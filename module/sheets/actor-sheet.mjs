import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from "../helpers/effects.mjs";

const { ActorSheetV2 } = foundry.applications.sheets;
const { HandlebarsApplicationMixin } = foundry.applications.api;

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheetV2}
 */
export class LadyBlackbirdActorSheet extends HandlebarsApplicationMixin(
  ActorSheetV2
) {
  static DEFAULT_OPTIONS = {
    classes: ["character-sheet"],
    position: {
      width: 800,
      height: 800,
    },
    window: {
      resizable: true,
    },
  };

  static PARTS = {
    form: {
      template:
        "systems/lady-blackbird/templates/actor/actor-character-sheet.hbs",
    },
  };

  /* -------------------------------------------- */

  /** @override */
  async _prepareContext(options = {}) {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = await super._prepareContext();

    // Use a safe clone of the actor data for further operations.
    const data = this.document.toObject(false);

    context.document = this.document;
    context.data = data;
    context.limited = this.document.limited;
    context.options = this.options;
    context.owner = this.document.isOwner;
    context.title = this.title;
    context.actor = this.actor;
    context.effects = context.data.effects;
    context.items = context.data.items;
    context.items.sort((a, b) => (a.sort || 0) - (b.sort || 0));
    context.systemSource = this.actor.system._source;
    context.systemFields = this.document.system.schema.fields;
    context.system = this.system;

    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  _onRender(context, options) {
    super._onRender(context, options);
  }
}
