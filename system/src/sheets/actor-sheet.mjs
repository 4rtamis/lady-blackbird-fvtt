const { sheets, api } = foundry.applications;

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheetV2}
 */
export class LadyBlackbirdActorSheet extends api.HandlebarsApplicationMixin(
  sheets.ActorSheetV2,
) {
  // Define the default options for the sheet
  _editModeEnabled = false;

  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["lady-blackbird", "sheet", "character-sheet"],
    tag: "form",
    form: {
      submitOnChange: true,
      closeOnSubmit: false,
    },
    position: {
      width: 800,
      height: "auto",
    },
    window: {
      resizable: true,
    },
    actions: {
      //editImage: this._onEditImage,
      onRoll: this._onRoll,
      toggleEditMode: this._onToggleEditMode,
    },
  };

  static PARTS = {
    form: {
      template:
        "systems/lady-blackbird/templates/actor/actor-character-sheet.hbs",
    },
  };

  get system() {
    return this.actor.system;
  }

  static async _onToggleEditMode(event, target) {
    event.preventDefault();
    this._editModeEnabled = !this._editModeEnabled;
    await this.submit();
    this.render();
  }

  static async _onRoll(event, target) {
    event.preventDefault();
    const formula = target.dataset.formula;
    const roll = new foundry.dice.Roll(formula);
    await roll.evaluate();
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `${this.actor.name} rolls ${formula}`,
    });
  }

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

    const isEditable = this.isEditable;

    context.cssClass = isEditable ? "editable" : "locked";
    context.editable = isEditable;
    context.editModeEnabled = this._editModeEnabled;
    context.editModeDisabled = !this._editModeEnabled;

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

  async _onFirstRender(context, options) {
    await super._onFirstRender(context, options);
  }

  /** @override */
  _onRender(context, options) {
    super._onRender(context, options);
  }
}
